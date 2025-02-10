import type { Miner, MinersState } from "@/stores/minersSlice";
import { createMiner, deleteMiner } from "@/stores/minersSlice";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../stores";

const minersSelector = (state: RootState): MinersState => state.miners;

interface UseMinersReturn {
  miners: Miner[];
  createMiner: (miner: Miner) => void;
  deleteMiner: (miner: Miner) => void;
}

function useMiners(): UseMinersReturn {
  const dispatch = useDispatch();

  const { miners } = useSelector(minersSelector);

  return {
    miners,
    createMiner: (miner: Miner) => dispatch(createMiner(miner)),
    deleteMiner: (miner: Miner) => dispatch(deleteMiner(miner)),
  };
}

export default useMiners;
