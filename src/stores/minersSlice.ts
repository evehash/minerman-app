import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

type MinerType = "axe-os" | "avalon-nano-3";
type MinerAdapter = "esp-miner-2" | "avalon-nano-3";

interface Miner {
  ip: string;
  adapter: MinerAdapter;
}

interface MinersState {
  miners: Miner[];
}

const initialState: MinersState = {
  miners: [],
};

export const minersSlice = createSlice({
  name: "miners",
  initialState: initialState,
  reducers: {
    createMiner({ miners }: MinersState, action: PayloadAction<Miner>) {
      const miner = action.payload;
      miners.push(miner);
    },
    deleteMiner(state, action: PayloadAction<Miner>) {
      const { ip, adapter } = action.payload;
      state.miners = state.miners.filter((miner) => miner.ip !== ip || miner.adapter !== adapter);
    },
    reorderDevice({ miners }: MinersState, action: PayloadAction<{ fromIndex: number; toIndex: number }>) {
      const { fromIndex, toIndex } = action.payload;
      const [movedMiner] = miners.splice(fromIndex, 1);
      miners.splice(toIndex, 0, movedMiner);
    },
  },
});

//export const selectDevices = (state: RootState) => state.devices.devices;

export const { createMiner, reorderDevice, deleteMiner } = minersSlice.actions;

export default minersSlice.reducer;

export type { Miner, MinersState, MinerType, MinerAdapter };
