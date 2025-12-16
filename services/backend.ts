export interface RenderRequestPayload {
  videoUrl: string;
  startTime: number;
  endTime: number;
  aspectRatio: string;
}

export interface RenderResponseData {
  clipId: string;
  downloadUrl: string;
  status: 'processing' | 'completed' | 'failed';
  estimatedTime?: string;
}

export interface RenderResponse {
  success: boolean;
  message: string;
  data: RenderResponseData;
}

export interface StatusResponse {
  success: boolean;
  status: 'processing' | 'completed' | 'failed';
  downloadUrl?: string;
  message?: string;
  fileSize?: number;
  createdAt?: string;
}

export interface VideoInfo {
  title: string;
  duration: string | number;
  thumbnail: string;
  description: string;
  author: string;
  viewCount: string | number;
}

export interface VideoInfoResponse {
  success: boolean;
  data: VideoInfo;
}

export interface CreateProjectResponse {
  success: boolean;
  message: string;
  data: {
    projectId: number;
    title: string;
    status: string;
    videoInfo: VideoInfo;
    estimatedTime: string;
  }
}

export interface DownloadStatusResponse {
  success: boolean;
  data: {
    projectId: number;
    status: string;
    downloaded: boolean;
    progress: number;
    readyForEditing: boolean;
  }
}

export interface BatchProcessResponse {
    success: boolean;
    message: string;
    data: {
        projectId: string;
        clipsCount: number;
        estimatedTime: string;
    }
}

export interface ClipRequest {
    title: string;
    startTime: number;
    endTime: number;
    aspectRatio: string;
}

export interface ConnectionTestResult {
  success: boolean;
  message: string;
  details?: any;
}

// Helper headers to bypass Ngrok warning and ensure JSON
const getHeaders = () => ({
  'Content-Type': 'application/json',
  'ngrok-skip-browser-warning': 'true',
  'Accept': 'application/json'
});

// Helper to safely handle response parsing
const handleResponse = async (response: Response) => {
  const text = await response.text();
  try {
    // Try to parse JSON
    const data = JSON.parse(text);
    
    if (!response.ok) {
        throw new Error(data.message || `Server Error (${response.status})`);
    }
    return data;
  } catch (e) {
    // If parsing fails, check if it looks like HTML (Ngrok Interstitial or 404/500 Page)
    if (text.trim().startsWith('<')) {
       const isNgrok = text.includes('ngrok') || text.includes('Visit Site');
       if (isNgrok) {
         throw new Error("Connection blocked by Ngrok Interstitial page. Please open the Backend URL in a new tab and click 'Visit Site'.");
       }
       throw new Error(`Backend returned HTML instead of JSON (Status ${response.status}). This usually means the endpoint URL is wrong or the server crashed.`);
    }
    throw new Error(`Invalid response from server: ${text.substring(0, 50)}...`);
  }
};

// Function to test connectivity
export const testBackendConnection = async (baseUrl: string): Promise<ConnectionTestResult> => {
  try {
    const cleanUrl = baseUrl.replace(/\/$/, '');
    const response = await fetch(`${cleanUrl}/`, {
      method: 'GET',
      headers: getHeaders()
    });

    const data = await handleResponse(response);
    
    return { 
      success: true, 
      message: "Connected successfully to Pocat.io API",
      details: data
    };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

export const getVideoInfo = async (baseUrl: string, videoUrl: string): Promise<VideoInfoResponse> => {
  try {
    const cleanUrl = baseUrl.replace(/\/$/, '');
    const response = await fetch(`${cleanUrl}/video/info?url=${encodeURIComponent(videoUrl)}`, {
      method: 'GET',
      headers: getHeaders()
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Get Video Info Error:", error);
    throw error;
  }
};

// V2: Create Project (Downloads video)
export const createProject = async (baseUrl: string, youtubeUrl: string, title: string = 'New Project'): Promise<CreateProjectResponse> => {
  try {
    const cleanUrl = baseUrl.replace(/\/$/, '');
    // Using a hardcoded userId for MVP
    const response = await fetch(`${cleanUrl}/v2/projects`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        title,
        youtubeUrl,
        userId: 1, 
        quality: '720p'
      })
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Create Project Error:", error);
    throw error;
  }
};

// V2: Check Download Status
export const getProjectDownloadStatus = async (baseUrl: string, projectId: number): Promise<DownloadStatusResponse> => {
  try {
    const cleanUrl = baseUrl.replace(/\/$/, '');
    const response = await fetch(`${cleanUrl}/v2/projects/${projectId}/download-status`, {
      method: 'GET',
      headers: getHeaders()
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Get Download Status Error:", error);
    throw error;
  }
};

// V2: Batch Process Clips
export const batchProcessClips = async (baseUrl: string, projectId: number, clips: ClipRequest[]): Promise<BatchProcessResponse> => {
  try {
    const cleanUrl = baseUrl.replace(/\/$/, '');
    const response = await fetch(`${cleanUrl}/v2/projects/${projectId}/batch-clips`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ clips })
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Batch Process Error:", error);
    throw error;
  }
};

export const renderClip = async (baseUrl: string, payload: RenderRequestPayload): Promise<RenderResponse> => {
  try {
    const cleanUrl = baseUrl.replace(/\/$/, '');
    const response = await fetch(`${cleanUrl}/clips/render`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });

    return await handleResponse(response);
  } catch (error) {
    console.error("Render Clip Service Error:", error);
    throw error;
  }
};

export const checkClipStatus = async (baseUrl: string, clipId: string): Promise<StatusResponse> => {
  try {
    const cleanUrl = baseUrl.replace(/\/$/, '');
    const response = await fetch(`${cleanUrl}/clips/status/${clipId}`, {
         headers: getHeaders()
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error("Check Status Error:", error);
    throw error;
  }
};