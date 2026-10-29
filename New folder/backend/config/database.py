"""
Database configuration.

Connects to MongoDB when available. If MongoDB is not running,
falls back to an in-memory store that mimics the small subset of
the pymongo collection API used by the services, so the app keeps
working out of the box.
"""

import os

from bson import ObjectId
from dotenv import load_dotenv
from pymongo import MongoClient
from pymongo.errors import PyMongoError

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "internship_academy")


# ==========================
# In-memory fallback
# ==========================

class _InsertOneResult:
    def __init__(self, inserted_id):
        self.inserted_id = inserted_id


class _UpdateResult:
    def __init__(self, matched_count, modified_count):
        self.matched_count = matched_count
        self.modified_count = modified_count


class _DeleteResult:
    def __init__(self, deleted_count):
        self.deleted_count = deleted_count


class MemoryCollection:
    """Tiny pymongo-compatible collection backed by a python list."""

    def __init__(self, name):
        self.name = name
        self._docs = []

    def _matches(self, doc, query):
        if not query:
            return True
        for key, value in query.items():
            if doc.get(key) != value:
                return False
        return True

    def find(self, query=None, sort=None, limit=0):
        results = [dict(doc) for doc in self._docs if self._matches(doc, query)]
        if sort:
            for key, direction in reversed(sort):
                results.sort(
                    key=lambda d: (d.get(key) is None, d.get(key)),
                    reverse=direction < 0,
                )
        if limit:
            results = results[:limit]
        return results

    def find_one(self, query=None):
        for doc in self._docs:
            if self._matches(doc, query):
                return dict(doc)
        return None

    def insert_one(self, document):
        document = dict(document)
        document.setdefault("_id", ObjectId())
        self._docs.append(document)
        return _InsertOneResult(document["_id"])

    def update_one(self, query, update):
        for doc in self._docs:
            if self._matches(doc, query):
                doc.update(update.get("$set", {}))
                return _UpdateResult(1, 1)
        return _UpdateResult(0, 0)

    def delete_one(self, query):
        for index, doc in enumerate(self._docs):
            if self._matches(doc, query):
                self._docs.pop(index)
                return _DeleteResult(1)
        return _DeleteResult(0)

    def count_documents(self, query=None):
        return len([doc for doc in self._docs if self._matches(doc, query)])


# ==========================
# Connection
# ==========================

USING_MEMORY_DB = False

try:
    client = MongoClient(MONGODB_URL, serverSelectionTimeoutMS=1500)
    client.admin.command("ping")
    database = client[DATABASE_NAME]
    print(f"MongoDB connected — using database '{DATABASE_NAME}'")
except PyMongoError as error:
    USING_MEMORY_DB = True
    database = None
    print("MongoDB not reachable — using in-memory store (data resets on restart)")

if USING_MEMORY_DB:
    admin_collection = MemoryCollection("admins")
    role_collection = MemoryCollection("roles")
    system_setting_collection = MemoryCollection("system_settings")
    activity_log_collection = MemoryCollection("activity_logs")
else:
    admin_collection = database["admins"]
    role_collection = database["roles"]
    system_setting_collection = database["system_settings"]
    activity_log_collection = database["activity_logs"]


def get_database():
    return database


def get_admin_collection():
    return admin_collection


def get_role_collection():
    return role_collection


def get_system_setting_collection():
    return system_setting_collection


def get_activity_log_collection():
    return activity_log_collection
