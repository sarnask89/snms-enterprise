import time
import os
from sqlalchemy import select, func, text
from sqlalchemy.orm import Session
from app import models
from app.database import engine, SessionLocal, Base

def benchmark_original(db: Session):
    start = time.time()
    for _ in range(100):
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
    return time.time() - start

def benchmark_optimized(db: Session):
    start = time.time()
    for _ in range(100):
        # Batching counts into a single query
        stmt = select(
            select(func.count()).select_from(models.Customer).scalar_subquery().label("customers"),
            select(func.count()).select_from(models.Invoice).scalar_subquery().label("invoices"),
            select(func.count()).select_from(models.Tariff).scalar_subquery().label("tariffs"),
            select(func.count()).select_from(models.SupportTicket).where(
                models.SupportTicket.status == models.TicketStatus.open
            ).scalar_subquery().label("tickets_open"),
            select(func.count()).select_from(models.Document).scalar_subquery().label("documents"),
            select(func.count()).select_from(models.CustomerDevice).scalar_subquery().label("nodes"),
            select(func.count()).select_from(models.Subscription).where(
                models.Subscription.active == True
            ).scalar_subquery().label("subs_active"),
        )
        result = db.execute(stmt).one()
        counts = {
            "customers": result.customers,
            "invoices": result.invoices,
            "tariffs": result.tariffs,
            "tickets_open": result.tickets_open,
            "documents": result.documents,
            "nodes": result.nodes,
            "subscriptions_active": result.subs_active,
        }
    return time.time() - start

def setup_data():
    # Initialize schema
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Check if we already have data
    if db.query(models.Customer).count() > 0:
        db.close()
        return

    # Seed some data for meaningful counts
    for i in range(100):
        db.add(models.Customer(customer_code=f"C{i:03d}", first_name="Test", last_name=f"User{i}"))

    for i in range(50):
        db.add(models.Tariff(name=f"Tariff {i}", monthly_price=100.0))

    db.commit()
    db.close()

if __name__ == "__main__":
    setup_data()
    db = SessionLocal()

    print("Starting benchmark (100 iterations each)...")
    orig_time = benchmark_original(db)
    print(f"Original (Multiple Queries): {orig_time:.4f} seconds")

    opt_time = benchmark_optimized(db)
    print(f"Optimized (Single Query): {opt_time:.4f} seconds")

    improvement = (orig_time - opt_time) / orig_time * 100
    print(f"Improvement: {improvement:.2f}%")

    db.close()
