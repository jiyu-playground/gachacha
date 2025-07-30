export interface mockDataType {
  id: number;
  emoji: string;
  text: string;
  likes: number;
  comments: number;
  timeAgo: number;
  spot: string;
}

export const mockData: mockDataType[] = [
  {
    id: 1,
    emoji: "🧸",
    text: "포켓몬 피카츄 골드 에디션 드디어 득템! 3개월 동안 찾던 희귀템이었는데 강남역에서 발견했어요!",
    likes: 24,
    comments: 8,
    timeAgo: 2,
    spot: "강남역",
  },
  {
    id: 2,
    emoji: "🦄",
    text: "유니콘 시리즈 컴플리트! 홍대에서 마지막 한 개 겟했습니다 ㅠㅠㅠ",
    likes: 15,
    comments: 3,
    timeAgo: 5,
    spot: "홍대역",
  },
  {
    id: 3,
    emoji: "🐱",
    text: "헬로키티 신상 나왔네요! 너무 귀여워서 3개 뽑았어요 💕",
    likes: 7,
    comments: 2,
    timeAgo: 24,
    spot: "홍대역",
  },
];
