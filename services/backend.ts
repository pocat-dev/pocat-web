
export interface BackendResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  error?: string;
}

export interface VideoInfo {
  duration: number | string;
  thumbnail: string;
  title: string;
}

export interface CreateProjectResponse extends BackendResponse {
  data: {
    projectId: number;
    status: 'pending' | 'downloading' | 'processing' | 'completed' | 'failed';
    videoInfo: VideoInfo;
    estimatedTime?: string;
  }
}

export interface ProjectStatusResponse extends BackendResponse {
  data: {
    readyForEditing: boolean;
    status: 'pending' | 'downloading' | 'processing' | 'completed' | 'failed';
    progress: number;
    video: {
      source: 'fresh' | 'shared' | 'cached';
    };
  }
}

export interface ClipProcessingResponse extends BackendResponse {
  data: {
    estimatedTime: string;
    jobId?: string;
  }
}

export interface RenderClipResponse extends BackendResponse {
  data: {
    clipId: string;
  }
}

export interface ClipStatusData {
  status: 'pending' | 'processing' | 'completed' | 'failed';
  downloadUrl?: string;
  error?: string;
}

export interface ClipStatusResponse extends BackendResponse {
  data: ClipStatusData;
}

const getHeaders = () => {
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };
};

const handleResponse = async <T>(response: Response): Promise<T> => {
  let data: any = {};
  const contentType = response.headers.get("content-type");
  
  if (contentType && contentType.includes("application/json")) {
    try {
      data = await response.json();
    } catch (e) {
      console.warn("Failed to parse JSON response:", e);
    }
  }

  if (!response.ok) {
    const errorMessage = data.message || data.error || response.statusText || `Request failed with status ${response.status}`;
    throw new Error(errorMessage);
  }

  // If the backend doesn't wrap in {data: ...}, we handle it
  if (data && typeof data === 'object' && !('data' in data)) {
    return { success: true, message: "OK", data: data } as unknown as T;
  }

  return data as T;
};

// --- API CLIENT METHODS ---

/**
 * GET /video/info?url=YOUTUBE_URL
 */
export const getVideoInfo = async (baseUrl: string, url: string): Promise<BackendResponse<VideoInfo>> => {
  const cleanUrl = baseUrl.replace(/\/$/, '');
  const response = await fetch(`${cleanUrl}/video/info?url=${encodeURIComponent(url)}`, {
    method: 'GET',
    headers: getHeaders()
  });
  return handleResponse<BackendResponse<VideoInfo>>(response);
};

/**
 * POST /v2/projects
 */
export const createProject = async (
  baseUrl: string, 
  youtubeUrl: string, 
  title: string = 'New Project', 
  quality: string = '720p',
  downloader: string = 'auto'
): Promise<CreateProjectResponse> => {
  const cleanUrl = baseUrl.replace(/\/$/, '');
  const response = await fetch(`${cleanUrl}/v2/projects`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      title,
      youtubeUrl,
      userId: 1,
      quality,
      downloader 
    })
  });
  return handleResponse<CreateProjectResponse>(response);
};

/**
 * GET /health
 */
export const testBackendConnection = async (baseUrl: string): Promise<{ success: boolean; message: string }> => {
  try {
    const cleanUrl = baseUrl.replace(/\/$/, '');
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`${cleanUrl}/health`, { 
        method: 'GET',
        headers: getHeaders(),
        signal: controller.signal
    }).catch(() => null);
    
    clearTimeout(timeoutId);

    if (response && response.ok) {
        return { success: true, message: "Pocat.io API is Online 💚" };
    }
    throw new Error("Server reachable but Health Check failed.");
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : "Connection failed" };
  }
};

/**
 * GET /v2/projects/:id/download-status
 */
export const getProjectDownloadStatus = async (baseUrl: string, projectId: number): Promise<ProjectStatusResponse> => {
  const cleanUrl = baseUrl.replace(/\/$/, '');
  const response = await fetch(`${cleanUrl}/v2/projects/${projectId}/download-status`, {
      method: 'GET',
      headers: getHeaders()
  });
  return handleResponse<ProjectStatusResponse>(response);
};

/**
 * POST /v2/projects/:id/batch-clips
 */
export const batchProcessClips = async (baseUrl: string, projectId: number, clips: any[]): Promise<ClipProcessingResponse> => {
  const cleanUrl = baseUrl.replace(/\/$/, '');
  const response = await fetch(`${cleanUrl}/v2/projects/${projectId}/batch-clips`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ clips })
  });
  return handleResponse<ClipProcessingResponse>(response);
};

/**
 * POST /clips/render (Demo Mode)
 */
export const renderClip = async (baseUrl: string, payload: any): Promise<RenderClipResponse> => {
  const cleanUrl = baseUrl.replace(/\/$/, '');
  const response = await fetch(`${cleanUrl}/clips/render`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
  });
  return handleResponse<RenderClipResponse>(response);
};

/**
 * GET /clips/status/:clipId (Demo Mode)
 */
export const checkClipStatus = async (baseUrl: string, clipId: string): Promise<ClipStatusResponse> => {
  const cleanUrl = baseUrl.replace(/\/$/, '');
  const response = await fetch(`${cleanUrl}/clips/status/${clipId}`, {
      method: 'GET',
      headers: getHeaders()
  });
  return handleResponse<ClipStatusResponse>(response);
};
