import streamlit as st
import pandas as pd
from datetime import datetime

# Streamlit Page Configuration
st.set_page_config(page_title="Mini KhataBook", page_icon="📖", layout="wide")

# Custom CSS matching Mini Khatabook style
st.markdown("""
    <style>
    .main { background-color: #f3f4f6; }
    .stButton>button { background-color: #2563eb; color: white; border-radius: 6px; border: none; font-weight: bold; }
    .summary-card { background-color: white; padding: 18px; border-radius: 10px; box-shadow: 0 2px 6px rgba(0,0,0,0.05); margin-bottom: 20px; }
    .metric-green { color: #16a34a; font-weight: bold; font-size: 20px; }
    .metric-red { color: #dc2626; font-weight: bold; font-size: 20px; }
    </style>
""", unsafe_allow_html=True)

# Initialize Session State
if "customers" not in st.session_state:
    st.session_state.customers = []
if "selected_customer" not in st.session_state:
    st.session_state.selected_customer = None

st.title("📖 Mini Khatabook - Full-Stack Ledger App")

# Calculate Overall Totals
all_credits = sum(entry["amount"] for c in st.session_state.customers for entry in c["entries"] if entry["type"] == "credit")
all_debits = sum(entry["amount"] for c in st.session_state.customers for entry in c["entries"] if entry["type"] == "debit")
overall_balance = all_credits - all_debits

# Dashboard Overall Summary
st.markdown(f"""
<div class="summary-card">
    <h3>📊 Overall Summary</h3>
    <p><b>Total Credit:</b> ₹{all_credits}</p>
    <p><b>Total Debit:</b> ₹{all_debits}</p>
    <p class="{'metric-green' if overall_balance >= 0 else 'metric-red'}">Net Balance: ₹{overall_balance}</p>
</div>
""", unsafe_allow_html=True)

col1, col2 = st.columns([1, 2])

# Left Column: Customer Panel
with col1:
    st.subheader("👥 Customers")
    new_cust_name = st.text_input("Enter customer name", key="new_cust")
    if st.button("Add Customer"):
        if new_cust_name.strip():
            st.session_state.customers.append({
                "id": str(datetime.now().timestamp()),
                "name": new_cust_name.strip(),
                "entries": []
            })
            st.rerun()

    cust_names = [c["name"] for c in st.session_state.customers]
    if cust_names:
        selected_name = st.radio("Select Customer", cust_names)
        for c in st.session_state.customers:
            if c["name"] == selected_name:
                st.session_state.selected_customer = c

        if st.button("Delete Selected Customer"):
            st.session_state.customers = [c for c in st.session_state.customers if c["name"] != selected_name]
            st.session_state.selected_customer = None
            st.rerun()

# Right Column: Entry Section & List
with col2:
    cust = st.session_state.selected_customer
    if cust:
        st.subheader(f"📝 Ledger for {cust['name']}")
        
        with st.form("add_entry_form"):
            amount = st.number_input("Amount (₹)", min_value=1, step=1)
            date_val = st.date_input("Date", datetime.now())
            note = st.text_input("Note (optional)")
            tx_type = st.selectbox("Transaction Type", ["Credit (You Got)", "Debit (You Gave)"])
            submitted = st.form_submit_button("Save Transaction")
            
            if submitted:
                entry_type = "credit" if "Credit" in tx_type else "debit"
                cust["entries"].append({
                    "id": str(datetime.now().timestamp()),
                    "type": entry_type,
                    "amount": amount,
                    "date": str(date_val),
                    "note": note
                })
                st.success("Transaction recorded!")
                st.rerun()

        # Display Entries
        if cust["entries"]:
            st.write("### Transaction History")
            df = pd.DataFrame(cust["entries"])
            st.dataframe(df[["type", "amount", "date", "note"]], use_container_width=True)
            
            cust_credits = sum(e["amount"] for e in cust["entries"] if e["type"] == "credit")
            cust_debits = sum(e["amount"] for e in cust["entries"] if e["type"] == "debit")
            c_bal = cust_credits - cust_debits
            
            st.write(f"**Total Credit:** ₹{cust_credits}")
            st.write(f"**Total Debit:** ₹{cust_debits}")
            st.markdown(f"### Net Balance: <span class='{'metric-green' if c_bal >= 0 else 'metric-red'}'>₹{c_bal}</span>", unsafe_allow_html=True)
        else:
            st.info("No entries yet for this customer.")
    else:
        st.info("Select a customer from the left panel to view their ledger.")
