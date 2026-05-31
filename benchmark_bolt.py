import time
import os
import sys
from sqlalchemy import select, func
from sqlalchemy.orm import Session

# Add current directory to path for imports
sys.path.append(os.getcwd())

from app.database import SessionLocal
from app import models

def benchmark_dashboard_counts():
    db = SessionLocal()
    try:
        start_time = time.perf_counter()

        # Current unoptimized approach
        n_customers = db.scalar(select(func.count()).select_from(models.Customer)) or 0
        n_invoices = db.scalar(select(func.count()).select_from(models.Invoice)) or 0
        n_tariffs = db.scalar(select(func.count()).select_from(models.Tariff)) or 0
        n_tickets_open = (
            db.scalar(
                select(func.count()).select_from(models.SupportTicket).where(
                    models.SupportTicket.status == models.TicketStatus.open
                )
            )
            or 0
        )
        n_documents = db.scalar(select(func.count()).select_from(models.Document)) or 0
        n_nodes = db.scalar(select(func.count()).select_from(models.CustomerDevice)) or 0
        n_subs = (
            db.scalar(
                select(func.count()).select_from(models.Subscription).where(
                    models.Subscription.active == True
                )
            )
            or 0
        )

        end_time = time.perf_counter()
        print(f"Unoptimized execution time: {(end_time - start_time) * 1000:.2f} ms")

        # Optimized approach
        start_time = time.perf_counter()

        counts = db.execute(
            select(
                select(func.count()).select_from(models.Customer).scalar_subquery(),
                select(func.count()).select_from(models.Invoice).scalar_subquery(),
                select(func.count()).select_from(models.Tariff).scalar_subquery(),
                select(func.count()).select_from(models.SupportTicket).where(models.SupportTicket.status == models.TicketStatus.open).scalar_subquery(),
                select(func.count()).select_from(models.Document).scalar_subquery(),
                select(func.count()).select_from(models.CustomerDevice).scalar_subquery(),
                select(func.count()).select_from(models.Subscription).where(models.Subscription.active == True).scalar_subquery(),
            )
        ).fetchone()

        end_time = time.perf_counter()
        print(f"Optimized execution time: {(end_time - start_time) * 1000:.2f} ms")

        if counts:
            print(f"Counts: {list(counts)}")

    finally:
        db.close()

if __name__ == "__main__":
    benchmark_dashboard_counts()
