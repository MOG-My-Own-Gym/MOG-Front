import { useState, useEffect } from 'react';
import { Card, Row, Col, Badge, ProgressBar } from 'react-bootstrap';
import styles from './css/Gamification.module.css';
import AchievementService from './services/achievementService';
import achievementConfig from './data/achievements.json';

export default function Gamification() {
  const [achievementService] = useState(() => new AchievementService(achievementConfig));
  const [achievements, setAchievements] = useState(achievementConfig.achievements);
  const [userSessions, setUserSessions] = useState([]); // 실제 운동 데이터로 교체
  const [totalStats, setTotalStats] = useState({
    totalSessions: 0,
    totalDuration: 0,
    unlockedAchievements: 0,
    completionRate: 0
  });

  // 업적 달성 상태 업데이트
  useEffect(() => {
    const unlockedAchievements = achievementService.checkAllAchievements(achievements, userSessions);
    const unlockedCount = unlockedAchievements.length;
    const completionRate = Math.round((unlockedCount / achievements.length) * 100);
    
    setTotalStats({
      totalSessions: userSessions.length,
      totalDuration: userSessions.reduce((sum, session) => sum + session.duration, 0),
      unlockedAchievements: unlockedCount,
      completionRate
    });
  }, [userSessions, achievements, achievementService]);

  // 업적 카테고리별 그룹화
  const groupedAchievements = achievements.reduce((groups, achievement) => {
    const category = achievement.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(achievement);
    return groups;
  }, {});

  // 카테고리 이름 매핑
  const categoryNames = {
    'Onboarding': '온보딩 & 초기 동기',
    'Milestone': '마일스톤',
    'Streak': '스트릭(연속일)',
    'Weekly': '주간 리듬',
    'Session': '세션 구성',
    'Session Pattern': '세션 패턴',
    'Monthly Volume': '볼륨(월간)',
    'Variety': '다양성',
    'Expertise': '전문성',
    'Time-of-Day': '시간대 루틴'
  };

  // 업적 상태 표시 (실제 구현 시 서버에서 가져온 데이터 사용)
  const getAchievementStatus = (achievement) => {
    const isUnlocked = achievementService.checkAchievementUnlock(achievement, userSessions);
    return {
      unlocked: isUnlocked,
      progress: 0, // 진행률 계산 로직 추가 필요
      lastUnlocked: null // 마지막 해금 시간
    };
  };

  return (
    <div className={styles.gamificationContainer}>
      <div className="container-fluid">
        <h2 className="mb-4">🏆 업적 시스템</h2>
        
        {/* 전체 통계 */}
        <Card className="mb-4">
          <Card.Header>
            <h4 className="mb-0">📊 전체 통계</h4>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={3} className="text-center mb-3">
                <h3 className="text-primary">{achievements.length}</h3>
                <p className="text-muted mb-0">전체 업적</p>
              </Col>
              <Col md={3} className="text-center mb-3">
                <h3 className="text-success">{totalStats.unlockedAchievements}</h3>
                <p className="text-muted mb-0">해금된 업적</p>
              </Col>
              <Col md={3} className="text-center mb-3">
                <h3 className="text-warning">{achievements.length - totalStats.unlockedAchievements}</h3>
                <p className="text-muted mb-0">잠긴 업적</p>
              </Col>
              <Col md={3} className="text-center mb-3">
                <h3 className="text-info">{totalStats.completionRate}%</h3>
                <p className="text-muted mb-0">달성률</p>
              </Col>
            </Row>
            <div className="mt-3">
              <ProgressBar 
                now={totalStats.completionRate} 
                variant="info" 
                className="mb-2"
              />
              <small className="text-muted">전체 진행률</small>
            </div>
          </Card.Body>
        </Card>

        {/* 카테고리별 업적 */}
        {Object.entries(groupedAchievements).map(([category, categoryAchievements]) => (
          <Card key={category} className="mb-4">
            <Card.Header>
              <h4 className="mb-0">{categoryNames[category] || category}</h4>
            </Card.Header>
            <Card.Body>
              <Row>
                {categoryAchievements.map(achievement => {
                  const status = getAchievementStatus(achievement);
                  return (
                    <Col key={achievement.id} xs={12} sm={6} md={4} className="mb-3">
                      <div className={`${styles.achievementItem} ${status.unlocked ? styles.unlocked : styles.locked}`}>
                        <div className={styles.achievementIcon}>
                          {achievement.icon}
                        </div>
                        <div className={styles.achievementInfo}>
                          <h6 className={styles.achievementName}>{achievement.name}</h6>
                          <p className={styles.achievementDescription}>{achievement.description}</p>
                          <div className="d-flex justify-content-between align-items-center">
                            <Badge bg={status.unlocked ? "success" : "secondary"}>
                              {status.unlocked ? "해금됨" : "잠김"}
                            </Badge>

                          </div>

                        </div>
                      </div>
                    </Col>
                  );
                })}
              </Row>
            </Card.Body>
          </Card>
        ))}

      </div>
    </div>
  );
}
