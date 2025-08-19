API Endpoints:

1. AVAILABILITY ENDPOINTS:
    - GET /api/availability/provider/{providerId}?activeOnly=true
    - GET /api/availability/{id}
    - POST /api/availability
    - PUT /api/availability/{id}
    - DELETE /api/availability/{id}
    - PATCH /api/availability/{id}/toggle-status

2. HOLIDAY ENDPOINTS:
    - GET /api/holidays/provider/{providerId}?upcomingOnly=true
    - GET /api/holidays/provider/{providerId}/range?startDate=2024-01-01&endDate=2024-12-31
    - GET /api/holidays/{id}
    - POST /api/holidays
    - PUT /api/holidays/{id}
    - DELETE /api/holidays/{id}
    - GET /api/holidays/provider/{providerId}/check?date=2024-06-15

SAMPLE JSON REQUESTS:

Create Availability:
{
"providerId": 1,
"dayOfWeek": "MONDAY",
"startTime": "09:00",
"endTime": "17:00",
"slotDurationMinutes": 30,
"breakTimes": [
{
"startTime": "12:00",
"endTime": "13:00",
"reason": "Lunch break"
}
],
"isActive": true
}

Create Holiday:
{
"providerId": 1,
"date": "2024-07-04",
"reason": "Independence Day",
"type": "FULL_DAY"
}

Create Partial Day Holiday:
{
"providerId": 1,
"date": "2024-06-15",
"reason": "Doctor appointment",
"type": "PARTIAL_DAY",
"startTime": "14:00",
"endTime": "16:00"
}