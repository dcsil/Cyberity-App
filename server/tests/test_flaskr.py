from flaskr import create_app
from flaskr.db import mongo
from flask import json, jsonify
from datetime import datetime,timedelta 

def getCurrentTimeStamp():
    return datetime.now()
    
def test_register(client):
    mongo.db.users.delete_many({})
    response = client.post("/api/register", json={
        "username": "", "password": "test_admin", "name": "admin", "email": "admin@gmail.com"
    })
    assert response.data == b'Missing/Incorrect Information'
    response = client.post("/api/register", json={
        "username": "test_admin", "password": "test_admin", "name": "admin", "email": "admin@gmail.com"
    })
    assert response.data == b'Username Already Exists' or response.data == b"User successfully created"

def test_login(client):
    response = client.post("/api/login", json={
        "username": "test_admin", "password": "test_admin"
    })
    response = client.get("/api/checkauth")
    assert response.status_code == 200

def test_logout(client):
    response = client.post("/api/login", json={
        "username": "test_admin", "password": "test_admin"
    })
    assert response.status_code == 200
    response = client.post("/api/logout", json={
        "username": "test_admin", "password": "test_admin"
    })
    assert response.status_code == 200

def test_getEmployees(client):
    response = client.post("/api/login", json={
        "username": "test_admin", "password": "test_admin"
    })
    response = client.get("/api/getEmployees")
    assert response.status_code == 200
    attributes_to_check = ('_id', 'name', 'email')
    data = response.get_json()
    assert len(data) == 0 or all(k in data[0] for k in attributes_to_check)

def test_getAllThreats(client):
    response = client.post("/api/login", json={
        "username": "test_admin", "password": "test_admin"
    })
    response = client.get("/api/getAllThreats")
    assert response.status_code == 200
    attributes_to_check = ('_id', 'detectionDate', 'status')
    data = response.get_json()
    assert len(data) == 0 or all(k in data[0] for k in attributes_to_check)

def test_getContainedThreats(client):
    response = client.post("/api/login", json={
        "username": "test_admin", "password": "test_admin"
    })
    response = client.get("/api/getContainedThreats")
    assert response.status_code == 200
    attributes_to_check = ('_id', 'detectionDate', 'status')
    data = response.get_json()
    assert len(data) == 0 or all(k in data[0] for k in attributes_to_check)

def test_getActiveThreats(client):
    response = client.post("/api/login", json={
        "username": "test_admin", "password": "test_admin"
    })
    response = client.get("/api/getActiveThreats")
    assert response.status_code == 200
    attributes_to_check = ('_id', 'detectionDate', 'status')
    data = response.get_json()
    assert len(data) == 0 or all(k in data[0] for k in attributes_to_check)

def test_getFalseThreats(client):
    response = client.post("/api/login", json={
        "username": "test_admin", "password": "test_admin"
    })
    response = client.get("/api/getFalseThreats")
    assert response.status_code == 200
    attributes_to_check = ('_id', 'detectionDate', 'status')
    data = response.get_json()
    assert len(data) == 0 or all(k in data[0] for k in attributes_to_check)

def test_login(client):
    response = client.post("/api/login", json={
        "username": "test_admin", "password": "test_admin"
    })
    response = client.get("/api/checkauth")
    assert response.status_code == 200

def test_truePositiveRate(client):
    response = client.post("/api/login", json={
        "username": "test_admin", "password": "test_admin"
    })
    response = client.get("/api/truePositiveRate")
    assert response.status_code == 200

def test_numContainedThreats(client):
    response = client.post("/api/login", json={
        "username": "test_admin", "password": "test_admin"
    })
    response = client.get("/api/numContainedThreats")
    pre_num_contained_threats = int(response.data)
    mongo.db.userThreats.insert_one({
        "detectionDate": getCurrentTimeStamp() - timedelta(days=4),
        "status": "contained",
        "name": "Ross",
        "email": "Ross@gmail.com",
        "role": "Developer",
        "department": "Software",
        "last_activity_date": "Today",
        "phone": "555",
        "flagged": False
    })
    response = client.get("/api/numContainedThreats")
    post_num_contained_threats = int(response.data)
    assert response.status_code == 200 and ((pre_num_contained_threats + 1) == post_num_contained_threats) 

def test_numActiveThreatsThreats(client):
    response = client.post("/api/login", json={
        "username": "test_admin", "password": "test_admin"
    })
    response = client.get("/api/numActiveThreats")
    pre_num_active_threats = int(response.data)
    mongo.db.userThreats.insert_one({
        "detectionDate": getCurrentTimeStamp() - timedelta(days=14),
        "status": "active",
        "name": "Ross",
        "email": "Ross@gmail.com",
        "role": "Developer",
        "department": "Software",
        "last_activity_date": "Today",
        "phone": "555",
        "flagged": True
    })
    response = client.get("/api/numActiveThreats")
    post_num_active_threats = int(response.data)
    assert response.status_code == 200 and ((pre_num_active_threats + 1) == post_num_active_threats) 

def test_numFalseThreatsThreats(client):
    response = client.post("/api/login", json={
        "username": "test_admin", "password": "test_admin"
    })
    response = client.get("/api/numFalseThreats")
    pre_num_false_threats = int(response.data)
    mongo.db.userThreats.insert_one({
        "detectionDate": getCurrentTimeStamp() - timedelta(days=6),
        "status": "false",
        "name": "Ross",
        "email": "Ross@gmail.com",
        "role": "Developer",
        "department": "Software",
        "last_activity_date": "Today",
        "phone": "555",
        "flagged": True
    })
    response = client.get("/api/numFalseThreats")
    post_num_false_threats = int(response.data)
    assert response.status_code == 200 and ((pre_num_false_threats + 1) == post_num_false_threats) 


def test_numTotalThreats(client):
    response = client.post("/api/login", json={
        "username": "test_admin", "password": "test_admin"
    })
    response = client.get("/api/numTotalThreats")
    pre_num_total_threats = int(response.data)
    mongo.db.userThreats.insert_one({
        "detectionDate": getCurrentTimeStamp() - timedelta(days=10),
        "status": "contained",
        "name": "Ross",
        "email": "Ross@gmail.com",
        "role": "Developer",
        "department": "Software",
        "last_activity_date": "Today",
        "phone": "555",
        "flagged": True
    })
    response = client.get("/api/numTotalThreats")
    post_num_total_threats = int(response.data)
    assert response.status_code == 200 and ((pre_num_total_threats + 1) == post_num_total_threats) 

def test_numThreatsByDate(client):
    response = client.post("/api/login", json={
        "username": "test_admin", "password": "test_admin"
    })
    d_date = getCurrentTimeStamp() - timedelta(days=7)
    s_date = "{}-{}-{}".format(d_date.year, str(d_date.month).zfill(2), str(d_date.day).zfill(2))
    mongo.db.userThreats.insert_one({
        "detectionDate": getCurrentTimeStamp() - timedelta(days=7),
        "status": "contained",
        "name": "Ross",
        "email": "Ross@gmail.com",
        "role": "Developer",
        "department": "Software",
        "last_activity_date": "Today",
        "phone": "555",
        "flagged": True
    })
    response = client.get("/api/numThreatsByDate") 
    threats_by_date = response.json
    date_exist = False
    for item in threats_by_date:
        if item["date"] == s_date:
            date_exist = True
            break
    assert response.status_code == 200 and date_exist

def test_securityRating(client):
    response = client.post("/api/login", json={
        "username": "test_admin", "password": "test_admin"
    })
    response = client.get("/api/securityRating")
    assert response.status_code == 200 and response.data 

def test_truePositiveRate(client):
    response = client.post("/api/login", json={
        "username": "test_admin", "password": "test_admin"
    })
    response = client.get("/api/truePositiveRate")
    pre_truepositive_rate = float(response.data)
    mongo.db.userThreats.insert_one({
        "detectionDate": getCurrentTimeStamp() - timedelta(days=2),
        "status": "false",
        "name": "Ross",
        "email": "Ross@gmail.com",
        "role": "Developer",
        "department": "Software",
        "last_activity_date": "Today",
        "phone": "555",
        "flagged": True
    })
    response = client.get("/api/truePositiveRate")
    post_truepositive_rate = float(response.data)
    assert response.status_code == 200 and (pre_truepositive_rate >= post_truepositive_rate)

def test_processLogs(client):
    response = client.post("/api/login", json={
        "username": "test_admin", "password": "test_admin"
    })
    response = client.post("/api/processLogs")
    assert response.status_code == 200