from fastapi import APIRouter, HTTPException

from admin import service
from admin.schema import AdminCreate, AdminUpdate
from utils.response import success_response

router = APIRouter(prefix="/admins", tags=["Admins"])


@router.get("/")
def get_all_admins():
    admins = service.get_all_admins()
    return success_response("Admins fetched successfully", admins)


@router.get("/{admin_id}")
def get_admin(admin_id: str):
    admin = service.get_admin_by_id(admin_id)
    if admin is None:
        raise HTTPException(status_code=404, detail="Admin not found")
    return success_response("Admin fetched successfully", admin)


@router.post("/", status_code=201)
def create_admin(admin: AdminCreate):
    created = service.create_admin(admin)
    return success_response("Admin created successfully", created)


@router.put("/{admin_id}")
def update_admin(admin_id: str, admin: AdminUpdate):
    updated = service.update_admin(admin_id, admin)
    if updated is None:
        raise HTTPException(status_code=404, detail="Admin not found")
    return success_response("Admin updated successfully", updated)


@router.delete("/{admin_id}")
def delete_admin(admin_id: str):
    deleted = service.delete_admin(admin_id)
    if deleted is None:
        raise HTTPException(status_code=404, detail="Admin not found")
    return success_response("Admin deleted successfully", deleted)
