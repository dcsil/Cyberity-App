from flaskr import create_app
from flaskr.db import mongo
from flask import json, jsonify

def test_hello(client):
    response = client.get("/hello")
    assert response.data == b"Hello, World!"


def test_register(client):
    response = client.post("/api/register", json={
        "username": "test_admin", "password": "test_admin", "name": "admin", "email": "admin@gmail.com"
    })
    assert response.data == b'Username Already Exists' or response.data == b"User successfully created"


def test_login(client):
    test_register(client)
    response = client.post("/api/login", json={
        "username": "test_admin", "password": "test_admin"
    })
    response_json = response.get_json()
    response = client.get("/api/checkauth", headers={
        "Authorization": "Bearer " + response_json['token']
    })
    assert response.status_code == 200


def test_getEmployees(client):
    response = client.post("/api/login", json={
        "username": "test_admin", "password": "test_admin"
    })
    response_json = response.get_json()
    response = client.get("/api/getEmployees", headers={
        "Authorization": "Bearer " + response_json['token']
    })
    assert response.status_code == 200
    attributes_to_check = ('_id', 'name', 'email', 'role', 'department', 'last_activity_date', 'phone', 'flagged')
    data = response.get_json()
    assert len(data) == 0 or all(k in data[0] for k in attributes_to_check)

def test_getAllThreats(client):
    response = client.post("/api/login", json={
        "username": "test_admin", "password": "test_admin"
    })
    response_json = response.get_json()
    response = client.get("/api/getAllThreats", headers={
        "Authorization": "Bearer " + response_json['token']
    })
    assert response.status_code == 200
    attributes_to_check = ('_id', 'detectionDate', 'status')
    data = response.get_json()
    assert len(data) == 0 or all(k in data[0] for k in attributes_to_check)


def test_login(client):
    test_register(client)
    response = client.post("/api/login", json={
        "username": "test_admin", "password": "test_admin"
    })
    response_json = response.get_json()
    response = client.get("/api/checkauth", headers={
        "Authorization": "Bearer " + response_json['token']
    })
    assert response.status_code == 200

def test_truePositiveRate(client):
    test_register(client)
    response = client.post("/api/login", json={
        "username": "test_admin", "password": "test_admin"
    })
    response_json = response.get_json()
    response = client.get("/api/truePositiveRate", headers={
        "Authorization": "Bearer " + response_json['token']
    })
    assert response.status_code == 200

def test_numContainedThreats(client):
    test_register(client)
    response = client.post("/api/login", json={
        "username": "test_admin", "password": "test_admin"
    })
    response_json = response.get_json()
    response = client.get("/api/numContainedThreats", headers={
        "Authorization": "Bearer " + response_json['token']
    })
    pre_num_contained_threats = int(response.data)
    mongo.db.containedThreats.insert_one({
        "detectionDate": "Today",
        "status": "test",
        "name": "Ross",
        "email": "Ross@gmail.com",
        "role": "Developer",
        "department": "Software",
        "last_activity_date": "Today",
        "phone": "555",
        "flagged": False
    })
    response = client.get("/api/numContainedThreats", headers={
        "Authorization": "Bearer " + response_json['token']
    })
    post_num_contained_threats = int(response.data)
    assert response.status_code == 200 and (pre_num_contained_threats + 1) == post_num_contained_threats 

def test_numActiveThreatsThreats(client):
    test_register(client)
    response = client.post("/api/login", json={
        "username": "test_admin", "password": "test_admin"
    })
    response_json = response.get_json()
    response = client.get("/api/numActiveThreats", headers={
        "Authorization": "Bearer " + response_json['token']
    })
    pre_num_active_threats = int(response.data)
    mongo.db.activeThreats.insert_one({
        "detectionDate": "Today",
        "status": "test",
        "name": "Ross",
        "email": "Ross@gmail.com",
        "role": "Developer",
        "department": "Software",
        "last_activity_date": "Today",
        "phone": "555",
        "flagged": True
    })
    response = client.get("/api/numActiveThreats", headers={
        "Authorization": "Bearer " + response_json['token']
    })
    post_num_active_threats = int(response.data)
    assert response.status_code == 200 and (pre_num_active_threats + 1) == post_num_active_threats 

def test_numTotalThreats(client):
    test_register(client)
    response = client.post("/api/login", json={
        "username": "test_admin", "password": "test_admin"
    })
    response_json = response.get_json()
    response = client.get("/api/numTotalThreats", headers={
        "Authorization": "Bearer " + response_json['token']
    })
    assert response.status_code == 200

def test_securityRating(client):
    test_register(client)
    response = client.post("/api/login", json={
        "username": "test_admin", "password": "test_admin"
    })
    response_json = response.get_json()
    response = client.get("/api/securityRating", headers={
        "Authorization": "Bearer " + response_json['token']
    })
    assert response.status_code == 200 and response.data 
