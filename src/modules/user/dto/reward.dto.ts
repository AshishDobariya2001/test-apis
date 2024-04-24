export class RewardDto {
  givenBy: string;
  givenTo: string;
  amount: number;
}

export class RewardHistoryDto {
  id: string;
  dateTime: Date;
  pointsReceived: number;
  givenByName: string;
}
