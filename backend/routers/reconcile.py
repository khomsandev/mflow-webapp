# backend/routers/reconcile.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from enum import Enum
from typing import List
from db import get_reconcile

router = APIRouter(prefix="/reconcile", tags=["reconcile"])


class Channel(str, Enum):
    BILL_PAYMENT = "BILL_PAYMENT"
    FASTPAY = "FASTPAY"
    COUNTER_SERVICE = "COUNTER_SERVICE"
    EASYPASS = "EASYPASS"
    MPASS = "MPASS"


class ReconcileRequest(BaseModel):
    channel: Channel
    ids: List[str] = Field(
        ...,
        min_items=1,
        max_items=1000,
        description="ID list (INVOICE_NO หรือ TRANSACTION_ID)",
    )


@router.post("/", summary="ค้นหา Reconcile ตามช่องทาง")
async def reconcile_search(req: ReconcileRequest):
    try:
        rows = get_reconcile(req.channel.value, req.ids)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))

    if not rows:
        raise HTTPException(status_code=404, detail="ไม่พบข้อมูลตามเงื่อนไขที่ระบุ")

    return {"count": len(rows), "data": rows}
