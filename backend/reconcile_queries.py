# backend/reconcile_queries.py
CHANNEL_SQL_MAP = {
    "BILL_PAYMENT": """
        SELECT *
        FROM INVOICE_SERVICE.VW_INVOICE_RECONCILE_BILL_NORMAL
        WHERE INVOICE_NO IN ({placeholders})
    """,
    "FASTPAY": """
        SELECT *
        FROM INVOICE_SERVICE.VW_INVOICE_RECONCILE_FASTPAY
        WHERE INVOICE_NO IN ({placeholders})
    """,
    "COUNTER_SERVICE": """
        SELECT *
        FROM INVOICE_SERVICE.VW_INVOICE_RECONCILE_CS
        WHERE INVOICE_NO IN ({placeholders})
    """,
    "EASYPASS": """
        SELECT *
        FROM MPASS_SERVICE.VW_INVOICE_RECONCILE_EASYPASS_2
        WHERE TRANSACTION_ID IN ({placeholders})
    """,
    "MPASS": """
        SELECT *
        FROM MPASS_SERVICE.VW_INVOICE_RECONCILE_MPASS_2
        WHERE TRANSACTION_ID IN ({placeholders})
    """,
}
