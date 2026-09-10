import streamlit as st
import pandas as pd
from datetime import datetime
import hashlib
import os

# Streamlit Page Configuration
st.set_page_config(page_title="Mini KhataBook", page_icon="📖", layout="wide")

# Helper function to hash passwords
def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

# Try connecting to MongoDB if MONGO_URI is set in Streamlit Secrets or Environment
use_mongo = False
db = None

if "MONGO_URI" in st.secrets:
    try:
        import pymongo
        client = pymongo.MongoClient(st.secrets["MONGO_URI"])
        db = client["khatabook"]
        use_mongo = True
    except Exception as e:
        use_mongo = False

# Custom CSS for clean UI in both light and dark themes
st.markdown("""
    <style>
    .stButton>button { 
        background-color: #2563eb !important; 
        color: white !important; 
        border-radius: 6px !important; 
        border: none !important; 
        font-weight: bold !important; 
    }
    .summary-card { 
        background-color: #ffffff; 
        color: #1f2937;
        padding: 20px; 
        border-radius: 10px; 
        box-shadow: 0 4px 10px rgba(0,0,0,0.08); 
        margin-bottom: 25px; 
    }
    .summary-card h3 { color: #111827 !important; margin-bottom: 10px; }
    .summary-card p { color: #374151 !important; margin: 4px 0; font-size: 16px; }
    .metric-green { color: #16a34a !important; font-weight: bold; font-size: 22px; }
    .metric-red { color: #dc2626 !important; font-weight: bold; font-size: 22px; }
    .auth-container {
        max-width: 420px;
        margin: 40px auto;
        padding: 30px;
        background: white;
        color: #111827;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }
    </style>
""", unsafe_allow_html=True)

# Session State Initialization
if "users_db" not in st.session_state:
    # Local fallback user DB: { email: { name, email, password_hash, customers: [] } }
    st.session_state.users_db = {}

if "current_user" not in st.session_state:
    st.session_state.current_user = None

if "selected_customer_id" not in st.session_state:
    st.session_state.selected_customer_id = None

# ==========================================
# AUTHENTICATION SECTION (Login / Register)
# ==========================================

if not st.session_state.current_user:
    st.title("📖 Mini Khatabook")
    st.subheader("Full-Stack Ledger Management Application")
    
    auth_mode = st.radio("Choose Option", ["Login", "Register"], horizontal=True)

    with st.container():
        if auth_mode == "Register":
            st.markdown("### Create New Account")
            reg_name = st.text_input("Full Name")
            reg_email = st.text_input("Email Address")
            reg_pass = st.text_input("Password (min 6 characters)", type="password")
            
            if st.button("Register Account"):
                if not reg_name or not reg_email or not reg_pass:
                    st.error("Please fill in all fields.")
                elif len(reg_pass) < 6:
                    st.error("Password must be at least 6 characters.")
                elif use_mongo and db.users.find_one({"email": reg_email.lower()}):
                    st.error("User already exists with this email.")
                elif not use_mongo and reg_email.lower() in st.session_state.users_db:
                    st.error("User already exists with this email.")
                else:
                    pass_hash = hash_password(reg_pass)
                    user_data = {
                        "name": reg_name.strip(),
                        "email": reg_email.lower().strip(),
                        "password": pass_hash,
                        "customers": []
                    }
                    if use_mongo:
                        db.users.insert_one(user_data)
                    else:
                        st.session_state.users_db[reg_email.lower().strip()] = user_data
                    
                    st.success("Registration successful! Please select 'Login' above.")

        else:
            st.markdown("### User Login")
            login_email = st.text_input("Email Address")
            login_pass = st.text_input("Password", type="password")
            
            if st.button("Login"):
                pass_hash = hash_password(login_pass)
                user_found = None

                if use_mongo:
                    user_found = db.users.find_one({"email": login_email.lower().strip(), "password": pass_hash})
                else:
                    usr = st.session_state.users_db.get(login_email.lower().strip())
                    if usr and usr["password"] == pass_hash:
                        user_found = usr

                if user_found:
                    st.session_state.current_user = {
                        "name": user_found["name"],
                        "email": user_found["email"]
                    }
                    st.rerun()
                else:
                    st.error("Invalid email or password.")

    st.stop()

# ==========================================
# AUTHENTICATED DASHBOARD SECTION
# ==========================================

current_user_email = st.session_state.current_user["email"]
current_user_name = st.session_state.current_user["name"]

# Helper functions for data management
def get_user_customers():
    if use_mongo:
        u = db.users.find_one({"email": current_user_email})
        return u.get("customers", []) if u else []
    else:
        u = st.session_state.users_db.get(current_user_email, {})
        return u.get("customers", [])

def save_user_customers(customers_list):
    if use_mongo:
        db.users.update_one({"email": current_user_email}, {"$set": {"customers": customers_list}})
    else:
        if current_user_email in st.session_state.users_db:
            st.session_state.users_db[current_user_email]["customers"] = customers_list

customers = get_user_customers()

# Header Bar with User Profile and Logout
header_col1, header_col2 = st.columns([3, 1])
with header_col1:
    st.title("📖 Mini Khatabook")
with header_col2:
    st.write(f"👤 **{current_user_name}**")
    if st.button("Logout"):
        st.session_state.current_user = None
        st.session_state.selected_customer_id = None
        st.rerun()

# Calculate Overall Totals
all_credits = sum(entry["amount"] for c in customers for entry in c.get("entries", []) if entry["type"] == "credit")
all_debits = sum(entry["amount"] for c in customers for entry in c.get("entries", []) if entry["type"] == "debit")
overall_balance = all_credits - all_debits

# Dashboard Overall Summary Card
st.markdown(f"""
<div class="summary-card">
    <h3>📊 Overall Summary</h3>
    <p><b>Total Credit:</b> ₹{all_credits}</p>
    <p><b>Total Debit:</b> ₹{all_debits}</p>
    <p class="{'metric-green' if overall_balance >= 0 else 'metric-red'}">Net Balance: ₹{overall_balance}</p>
</div>
""", unsafe_allow_html=True)

# Main Two-Column Layout
col1, col2 = st.columns([1, 2])

# Left Column: Customer Management Panel
with col1:
    st.subheader("👥 Customers")
    new_cust_name = st.text_input("Enter customer name", key="new_cust_input")
    
    if st.button("Add Customer"):
        if new_cust_name.strip():
            new_cust_id = str(datetime.now().timestamp())
            customers.append({
                "id": new_cust_id,
                "name": new_cust_name.strip(),
                "entries": []
            })
            save_user_customers(customers)
            st.session_state.selected_customer_id = new_cust_id
            st.rerun()

    if customers:
        cust_options = {c["id"]: c["name"] for c in customers}
        selected_id = st.radio(
            "Select Customer",
            options=list(cust_options.keys()),
            format_func=lambda x: cust_options[x]
        )
        st.session_state.selected_customer_id = selected_id

        if st.button("Delete Selected Customer"):
            customers = [c for c in customers if c["id"] != selected_id]
            save_user_customers(customers)
            st.session_state.selected_customer_id = None
            st.rerun()

# Right Column: Entry Section & Ledger Details
with col2:
    selected_customer = next((c for c in customers if c["id"] == st.session_state.selected_customer_id), None)

    if selected_customer:
        st.subheader(f"📝 Ledger for {selected_customer['name']}")
        
        with st.form("add_entry_form"):
            st.markdown("#### Add Transaction")
            amount = st.number_input("Amount (₹)", min_value=1, step=1)
            date_val = st.date_input("Date", datetime.now())
            note = st.text_input("Note (optional)")
            tx_type = st.selectbox("Transaction Type", ["You Got (Credit)", "You Gave (Debit)"])
            submitted = st.form_submit_button("Save Transaction")
            
            if submitted:
                entry_type = "credit" if "Credit" in tx_type else "debit"
                selected_customer["entries"].append({
                    "id": str(datetime.now().timestamp()),
                    "type": entry_type,
                    "amount": amount,
                    "date": str(date_val),
                    "note": note
                })
                save_user_customers(customers)
                st.success("Transaction saved!")
                st.rerun()

        # Display Entries & Balance
        entries = selected_customer.get("entries", [])
        if entries:
            st.markdown("### Transaction Entries")
            
            # Display entries with delete button
            for idx, entry in enumerate(entries):
                e_col1, e_col2, e_col3 = st.columns([3, 2, 1])
                sign = "+" if entry["type"] == "credit" else "-"
                color = "green" if entry["type"] == "credit" else "red"
                
                with e_col1:
                    st.markdown(f"**:{color}[{sign} ₹{entry['amount']}]**")
                    if entry.get("note"):
                        st.caption(f"Note: {entry['note']}")
                with e_col2:
                    st.caption(f"Date: {entry['date']}")
                with e_col3:
                    if st.button("Delete", key=f"del_{entry['id']}_{idx}"):
                        selected_customer["entries"].pop(idx)
                        save_user_customers(customers)
                        st.rerun()
                st.divider()

            cust_credits = sum(e["amount"] for e in entries if e["type"] == "credit")
            cust_debits = sum(e["amount"] for e in entries if e["type"] == "debit")
            c_bal = cust_credits - cust_debits
            
            st.write(f"**Total Credit:** ₹{cust_credits}")
            st.write(f"**Total Debit:** ₹{cust_debits}")
            st.markdown(
                f"### Net Balance: <span class='{'metric-green' if c_bal >= 0 else 'metric-red'}'>₹{c_bal}</span>", 
                unsafe_allow_html=True
            )
        else:
            st.info("No entries yet for this customer.")
    else:
        st.info("Select a customer from the left panel to view their transaction ledger.")
