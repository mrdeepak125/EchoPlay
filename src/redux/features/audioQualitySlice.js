import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  quality: 'high', // 'high' | 'medium' | 'low'
};

const audioQualitySlice = createSlice({
  name: 'audioQuality',
  initialState,
  reducers: {
    setQuality: (state, action) => {
      state.quality = action.payload;
    },
  },
});

export const { setQuality } = audioQualitySlice.actions;
export default audioQualitySlice.reducer;

// Helper: get download URL index based on quality
// downloadUrl array: [0]=48kbps, [1]=96kbps, [2]=160kbps, [3]=320kbps, [4]=320kbps-alt
export const getQualityUrl = (downloadUrl, quality) => {
  if (!downloadUrl || !downloadUrl.length) return '';
  const indices = { low: 0, medium: 2, high: 4 };
  const idx = indices[quality] ?? 4;
  return downloadUrl[Math.min(idx, downloadUrl.length - 1)]?.url || downloadUrl[downloadUrl.length - 1]?.url || '';
};
