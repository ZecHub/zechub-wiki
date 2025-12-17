import { TransactionFlow } from "./TransactionFlow";
import { Stage } from "./types";

export const TransactionContent = ({
  stage,
  isAnimating,
}: {
  stage: Stage;
  isAnimating: boolean;
}) => {
  if (!stage.transactionFrom || !stage.transactionTo || !stage.amount)
    return null;

  return (
    <TransactionFlow
      from={stage.transactionFrom}
      to={stage.transactionTo}
      amount={stage.amount}
      isAnimating={isAnimating}
    />
  );
};
