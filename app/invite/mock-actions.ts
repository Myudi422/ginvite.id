// Mock server actions untuk sample (tidak melakukan API call)
export async function recordContentView(cuId: number | string) {
  // Mock function - tidak melakukan API call
  console.log("Mock recordContentView called for:", cuId);
  return Promise.resolve({ success: true });
}

export async function midtransAction(params: any) {
  // Mock function - tidak melakukan API call
  console.log("Mock midtransAction called with:", params);
  return Promise.resolve({ 
    success: false, 
    message: "Fitur pembayaran tidak tersedia di mode sample" 
  });
}

export async function toggleStatusAction(params: any) {
  // Mock function - tidak melakukan API call
  console.log("Mock toggleStatusAction called with:", params);
  return Promise.resolve({ 
    success: false, 
    message: "Fitur aktivasi tidak tersedia di mode sample" 
  });
}