import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create test users
  const passwordHash = await bcrypt.hash('password123', 10);

  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'player1@test.com' },
      update: {},
      create: {
        email: 'player1@test.com',
        username: 'ProGamer',
        passwordHash,
        rating: 1500,
        seasonRating: 1500,
        tier: 'GOLD_1',
        peakRating: 1600,
        peakTier: 'GOLD_1',
        level: 15,
        experience: 2500,
        coins: 5000,
        gems: 100,
        gamesPlayed: 50,
        gamesWon: 30,
        gamesLost: 18,
        gamesDraw: 2,
        winStreak: 3,
        maxWinStreak: 7,
      },
    }),
    prisma.user.upsert({
      where: { email: 'player2@test.com' },
      update: {},
      create: {
        email: 'player2@test.com',
        username: 'NumBallMaster',
        passwordHash,
        rating: 1800,
        seasonRating: 1800,
        tier: 'PLATINUM_3',
        peakRating: 1900,
        peakTier: 'PLATINUM_2',
        level: 25,
        experience: 8000,
        coins: 12000,
        gems: 250,
        gamesPlayed: 120,
        gamesWon: 85,
        gamesLost: 30,
        gamesDraw: 5,
        winStreak: 5,
        maxWinStreak: 12,
      },
    }),
    prisma.user.upsert({
      where: { email: 'player3@test.com' },
      update: {},
      create: {
        email: 'player3@test.com',
        username: 'Rookie',
        passwordHash,
        rating: 1000,
        seasonRating: 1000,
        tier: 'SILVER_1',
        peakRating: 1050,
        peakTier: 'SILVER_1',
        level: 3,
        experience: 300,
        coins: 500,
        gems: 10,
        gamesPlayed: 5,
        gamesWon: 1,
        gamesLost: 4,
        gamesDraw: 0,
        winStreak: 0,
        maxWinStreak: 1,
      },
    }),
    prisma.user.upsert({
      where: { email: 'legend@test.com' },
      update: {},
      create: {
        email: 'legend@test.com',
        username: 'LegendPlayer',
        passwordHash,
        rating: 2500,
        seasonRating: 2500,
        tier: 'MASTER_1',
        peakRating: 2800,
        peakTier: 'LEGEND',
        level: 99,
        experience: 999999,
        coins: 100000,
        gems: 5000,
        gamesPlayed: 1000,
        gamesWon: 850,
        gamesLost: 130,
        gamesDraw: 20,
        winStreak: 20,
        maxWinStreak: 35,
      },
    }),
  ]);

  console.log(`✅ Created ${users.length} test users`);

  // Create current season
  const season = await prisma.season.upsert({
    where: { seasonNumber: 1 },
    update: {},
    create: {
      seasonNumber: 1,
      name: '시즌 1 - 새로운 시작',
      nameEn: 'Season 1 - New Beginning',
      startDate: new Date(),
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
      isActive: true,
      rewards: {
        LEGEND: { coins: 50000, gems: 500, title: 'Season 1 Legend' },
        MASTER: { coins: 30000, gems: 300, title: 'Season 1 Master' },
        DIAMOND: { coins: 20000, gems: 200 },
        PLATINUM: { coins: 10000, gems: 100 },
        GOLD: { coins: 5000, gems: 50 },
      },
    },
  });

  console.log(`✅ Created season: ${season.name}`);

  // Create achievements
  const achievements = await Promise.all([
    prisma.achievement.upsert({
      where: { code: 'first-win' },
      update: {},
      create: {
        code: 'first-win',
        name: '첫 승리',
        nameEn: 'First Victory',
        description: '첫 게임에서 승리하세요',
        descriptionEn: 'Win your first game',
        category: 'BEGINNER',
        conditionType: 'WINS',
        conditionValue: 1,
        iconUrl: '🏆',
        rewardCoins: 100,
        rarity: 'COMMON',
      },
    }),
    prisma.achievement.upsert({
      where: { code: 'win-streak-5' },
      update: {},
      create: {
        code: 'win-streak-5',
        name: '연승 행진',
        nameEn: 'Hot Streak',
        description: '5연승을 달성하세요',
        descriptionEn: 'Win 5 games in a row',
        category: 'WINNING',
        conditionType: 'WIN_STREAK',
        conditionValue: 5,
        iconUrl: '🔥',
        rewardCoins: 500,
        rarity: 'RARE',
      },
    }),
    prisma.achievement.upsert({
      where: { code: 'perfect-game' },
      update: {},
      create: {
        code: 'perfect-game',
        name: '완벽한 추리',
        nameEn: 'Perfect Read',
        description: '1번의 시도만에 정답을 맞추세요',
        descriptionEn: 'Win a game with only 1 guess',
        category: 'SKILL',
        conditionType: 'PERFECT_GAMES',
        conditionValue: 1,
        iconUrl: '🎯',
        rewardCoins: 1000,
        rewardGems: 10,
        rarity: 'LEGENDARY',
      },
    }),
    prisma.achievement.upsert({
      where: { code: 'games-100' },
      update: {},
      create: {
        code: 'games-100',
        name: '베테랑',
        nameEn: 'Veteran',
        description: '100게임을 플레이하세요',
        descriptionEn: 'Play 100 games',
        category: 'PROGRESS',
        conditionType: 'GAMES_PLAYED',
        conditionValue: 100,
        iconUrl: '🎮',
        rewardCoins: 2000,
        rarity: 'EPIC',
      },
    }),
    prisma.achievement.upsert({
      where: { code: 'reach-gold' },
      update: {},
      create: {
        code: 'reach-gold',
        name: '골드 달성',
        nameEn: 'Golden Player',
        description: '골드 티어에 도달하세요',
        descriptionEn: 'Reach Gold tier',
        category: 'RANK',
        conditionType: 'TIER',
        conditionValue: 1200,
        iconUrl: '🥇',
        rewardCoins: 1000,
        rarity: 'RARE',
      },
    }),
    prisma.achievement.upsert({
      where: { code: 'reach-diamond' },
      update: {},
      create: {
        code: 'reach-diamond',
        name: '다이아몬드 마인드',
        nameEn: 'Diamond Mind',
        description: '다이아몬드 티어에 도달하세요',
        descriptionEn: 'Reach Diamond tier',
        category: 'RANK',
        conditionType: 'TIER',
        conditionValue: 2000,
        iconUrl: '💎',
        rewardCoins: 5000,
        rewardGems: 50,
        rarity: 'LEGENDARY',
      },
    }),
  ]);

  console.log(`✅ Created ${achievements.length} achievements`);

  // Create shop items
  const items = await Promise.all([
    prisma.item.upsert({
      where: { code: 'avatar-frame-gold' },
      update: {},
      create: {
        code: 'avatar-frame-gold',
        name: '황금 프레임',
        nameEn: 'Golden Frame',
        description: '화려한 황금 아바타 프레임',
        descriptionEn: 'A prestigious golden avatar frame',
        category: 'AVATAR_FRAME',
        rarity: 'EPIC',
        priceCoins: 5000,
        imageUrl: '🖼️',
      },
    }),
    prisma.item.upsert({
      where: { code: 'number-style-neon' },
      update: {},
      create: {
        code: 'number-style-neon',
        name: '네온 숫자',
        nameEn: 'Neon Numbers',
        description: '빛나는 네온 스타일 숫자',
        descriptionEn: 'Glowing neon number style',
        category: 'NUMBER_STYLE',
        rarity: 'RARE',
        priceCoins: 2000,
        imageUrl: '✨',
      },
    }),
    prisma.item.upsert({
      where: { code: 'hint-pack-10' },
      update: {},
      create: {
        code: 'hint-pack-10',
        name: '힌트 10개 팩',
        nameEn: 'Hint Pack x10',
        description: '게임에서 사용할 수 있는 힌트 10개',
        descriptionEn: '10 hints for use in games',
        category: 'CONSUMABLE',
        rarity: 'COMMON',
        priceCoins: 500,
        imageUrl: '💡',
        itemType: 'HINT',
        itemEffect: { count: 10 },
      },
    }),
    prisma.item.upsert({
      where: { code: 'exp-boost-24h' },
      update: {},
      create: {
        code: 'exp-boost-24h',
        name: '24시간 경험치 부스트',
        nameEn: '24h EXP Boost',
        description: '24시간 동안 경험치 2배',
        descriptionEn: 'Double EXP for 24 hours',
        category: 'BOOST',
        rarity: 'RARE',
        priceGems: 50,
        imageUrl: '⚡',
        itemType: 'BOOST',
        itemEffect: { type: 'EXP', multiplier: 2 },
        itemDuration: 86400,
      },
    }),
    prisma.item.upsert({
      where: { code: 'title-champion' },
      update: {},
      create: {
        code: 'title-champion',
        name: '챔피언 칭호',
        nameEn: 'Champion Title',
        description: '"챔피언" 칭호를 표시합니다',
        descriptionEn: 'Display "Champion" title',
        category: 'TITLE',
        rarity: 'LEGENDARY',
        priceGems: 200,
        imageUrl: '👑',
        itemType: 'TITLE',
      },
    }),
  ]);

  console.log(`✅ Created ${items.length} shop items`);

  // Create sample games between users
  const games = await Promise.all([
    prisma.game.create({
      data: {
        mode: 'CLASSIC_4',
        status: 'COMPLETED',
        player1Id: users[0].id,
        player2Id: users[1].id,
        player1Secret: '1234',
        player2Secret: '5678',
        player1Ready: true,
        player2Ready: true,
        winnerId: users[1].id,
        winReason: 'CORRECT_GUESS',
        currentTurn: 14,
        player1RatingBefore: 1500,
        player1RatingAfter: 1485,
        player1RatingChange: -15,
        player2RatingBefore: 1800,
        player2RatingAfter: 1812,
        player2RatingChange: 12,
        startedAt: new Date(Date.now() - 3600000),
        endedAt: new Date(Date.now() - 3500000),
        totalDuration: 100,
        isRanked: true,
      },
    }),
    prisma.game.create({
      data: {
        mode: 'SPEED',
        status: 'COMPLETED',
        player1Id: users[0].id,
        player2Id: users[2].id,
        player1Secret: '9012',
        player2Secret: '3456',
        player1Ready: true,
        player2Ready: true,
        winnerId: users[0].id,
        winReason: 'CORRECT_GUESS',
        currentTurn: 11,
        player1RatingBefore: 1485,
        player1RatingAfter: 1510,
        player1RatingChange: 25,
        player2RatingBefore: 1000,
        player2RatingAfter: 985,
        player2RatingChange: -15,
        startedAt: new Date(Date.now() - 7200000),
        endedAt: new Date(Date.now() - 7100000),
        totalDuration: 100,
        timeLimit: 10,
        isRanked: true,
      },
    }),
  ]);

  console.log(`✅ Created ${games.length} sample games`);

  // Add some game moves
  await prisma.gameMove.createMany({
    data: [
      { gameId: games[0].id, playerId: users[0].id, turnNumber: 1, guess: '5678', strikes: 0, balls: 2, timeSpent: 15 },
      { gameId: games[0].id, playerId: users[1].id, turnNumber: 2, guess: '1234', strikes: 0, balls: 2, timeSpent: 12 },
      { gameId: games[0].id, playerId: users[0].id, turnNumber: 3, guess: '6789', strikes: 1, balls: 1, timeSpent: 18 },
      { gameId: games[0].id, playerId: users[1].id, turnNumber: 4, guess: '2143', strikes: 1, balls: 2, timeSpent: 10 },
    ],
  });

  console.log('✅ Created sample game moves');

  // System config
  await prisma.systemConfig.upsert({
    where: { key: 'maintenance_mode' },
    update: {},
    create: {
      key: 'maintenance_mode',
      value: { enabled: false, message: '' },
      description: 'Maintenance mode settings',
    },
  });

  await prisma.systemConfig.upsert({
    where: { key: 'game_settings' },
    update: {},
    create: {
      key: 'game_settings',
      value: {
        defaultTimeLimit: 30,
        maxAttempts: 10,
        hintsEnabled: true,
        itemsEnabled: true,
      },
      description: 'Default game settings',
    },
  });

  console.log('✅ Created system config');

  console.log('🎉 Seeding completed!');
  console.log('\n📝 Test accounts:');
  console.log('  - player1@test.com / password123 (Gold 1)');
  console.log('  - player2@test.com / password123 (Platinum 3)');
  console.log('  - player3@test.com / password123 (Silver 1)');
  console.log('  - legend@test.com / password123 (Master 1)');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
