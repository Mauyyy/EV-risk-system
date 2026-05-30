from typing import Literal

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


RiskLevel = Literal["低风险", "中风险", "高风险"]


class Detection(BaseModel):
    label: str
    confidence: float
    severity: Literal["low", "medium", "high"]


class RiskCase(BaseModel):
    id: str
    title: str
    station: str
    port: str
    ts_score: int
    vision_score: int
    ts_confidence: float
    vision_confidence: float
    detections: list[Detection]


app = FastAPI(title="充安智护 API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


SITES = [
    {"id": "east-yard", "name": "东苑宿舍区充电棚", "riskScore": 91, "riskLevel": "高风险", "activeSessions": 74},
    {"id": "library-north", "name": "图书馆北侧充电点", "riskScore": 58, "riskLevel": "中风险", "activeSessions": 41},
    {"id": "innovation-park", "name": "科创园集中充电区", "riskScore": 34, "riskLevel": "低风险", "activeSessions": 68},
]

CASES = {
    "case-a12": RiskCase(
        id="case-a12",
        title="A12 飞线充电叠加温升异常",
        station="东苑宿舍区充电棚 A区",
        port="A12",
        ts_score=86,
        vision_score=94,
        ts_confidence=0.88,
        vision_confidence=0.82,
        detections=[
            Detection(label="飞线充电", confidence=0.93, severity="high"),
            Detection(label="通道占用", confidence=0.87, severity="medium"),
            Detection(label="电池外观异常", confidence=0.76, severity="high"),
        ],
    )
}

ALERTS = [
    {
        "id": "AL-20260529-018",
        "caseId": "case-a12",
        "level": "高风险",
        "station": "东苑宿舍区充电棚 A区 A12",
        "type": "飞线充电 / 温升异常",
        "status": "待现场复核",
    }
]


def classify(score: int) -> RiskLevel:
    if score >= 80:
        return "高风险"
    if score >= 50:
        return "中风险"
    return "低风险"


def build_decision(case: RiskCase, window: int) -> dict:
    ts_weight = case.ts_confidence / (case.ts_confidence + case.vision_confidence)
    vision_weight = 1 - ts_weight
    window_bonus = {3: -4, 5: 0, 10: 3}.get(window, 0)
    fused_score = round(case.ts_score * ts_weight + case.vision_score * vision_weight + window_bonus)
    hard_rule = any(item.label == "飞线充电" and item.confidence >= 0.86 for item in case.detections)
    final_score = max(fused_score, 86) if hard_rule else fused_score

    return {
        "caseId": case.id,
        "station": case.station,
        "port": case.port,
        "window": window,
        "score": final_score,
        "level": "高风险" if hard_rule else classify(final_score),
        "tsWeight": round(ts_weight, 3),
        "visionWeight": round(vision_weight, 3),
        "hardRule": hard_rule,
    }


@app.get("/api/overview")
def overview() -> dict:
    return {
        "onlinePorts": 350,
        "activeSessions": 183,
        "mediumHighRisks": 8,
        "sites": SITES,
    }


@app.get("/api/sites")
def sites() -> list[dict]:
    return SITES


@app.get("/api/cases/{case_id}")
def case_detail(case_id: str) -> RiskCase:
    return CASES[case_id]


@app.get("/api/cases/{case_id}/decision")
def case_decision(case_id: str, window: int = Query(default=5, ge=3, le=10)) -> dict:
    return build_decision(CASES[case_id], window)


@app.get("/api/alerts")
def alerts() -> list[dict]:
    return ALERTS


@app.post("/api/alerts/{alert_id}/close")
def close_alert(alert_id: str) -> dict:
    return {"id": alert_id, "status": "已闭环", "message": "处置记录已归档"}
