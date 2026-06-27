from database import SessionLocal, engine
from models import Base, User, BusinessRecord
from auth_utils import hash_password

Base.metadata.create_all(bind=engine)

db = SessionLocal()

records = [
    BusinessRecord(client_name="Acme Corp",    deal_value=12400, status="Active", updated_by=1),
    BusinessRecord(client_name="NovaTech",     deal_value=8200,  status="Lead",   updated_by=1),
    BusinessRecord(client_name="Bright LLC",   deal_value=5750,  status="Closed", updated_by=2),
    BusinessRecord(client_name="Delta Co",     deal_value=21000, status="Active", updated_by=1),
    BusinessRecord(client_name="Orbit Inc",    deal_value=9300,  status="Lead",   updated_by=2),
    BusinessRecord(client_name="Spark Media",  deal_value=15600, status="Active", updated_by=1),
    BusinessRecord(client_name="Blue Ridge",   deal_value=4200,  status="Closed", updated_by=2),
    BusinessRecord(client_name="Pinnacle Co",  deal_value=33000, status="Active", updated_by=1),
    BusinessRecord(client_name="Crest Labs",   deal_value=7800,  status="Lead",   updated_by=2),
    BusinessRecord(client_name="Vantage Corp", deal_value=18500, status="Active", updated_by=1),
]

db.add_all(records)
db.commit()
print(f"Seeded {len(records)} records successfully")
db.close()
