
export interface BackendResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  error?: string; // Add optional error field for failure cases
}

export interface VideoInfo {
  duration: number | string;
  thumbnail: string;
  title?: string;
}

export interface CreateProjectResponse extends BackendResponse {
  data: {
    projectId: number;
    videoInfo: VideoInfo;
    estimatedTime: string;
  }
}

export interface ProjectStatusResponse extends BackendResponse {
  data: {
    readyForEditing: boolean;
    downloaded?: boolean;
    progress?: number;
    status?: 'pending' | 'downloading' | 'processing' | 'completed' | 'failed';
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
    // Add Authorization header here if needed in future
    // 'Authorization': `Bearer ${token}` 
  };
};

/**
 * Standardized response handler.
 * Tries to parse JSON, handles HTTP errors, and normalizes the output.
 */
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
    // Construct a meaningful error message
    const errorMessage = data.message || data.error || response.statusText || `Request failed with status ${response.status}`;
    
    // You could throw a custom error object here if you wanted specific error codes
    throw new Error(errorMessage);
  }

  // Ensure the structure matches BackendResponse even if the backend returns something slightly different
  // This acts as a localized adapter/interceptor
  if (data && typeof data === 'object') {
     return data as T;
  }

  // Fallback for empty success responses
  return { success: true, message: "Success", data: {} } as unknown as T;
};

// --- API CLIENT METHODS ---

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
      userId: 1, // Hardcoded for MVP
      quality,
      downloader 
    })
  });
  return handleResponse<CreateProjectResponse>(response);
};

export const testBackendConnection = async (baseUrl: string): Promise<{ success: boolean; message: string }> => {
  try {
    const cleanUrl = baseUrl.replace(/\/$/, '');
    
    // Try health endpoint first
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

    const response = await fetch(`${cleanUrl}/health`, { 
        method: 'GET',
        headers: getHeaders(),
        signal: controller.signal
    }).catch(() => null);
    
    clearTimeout(timeoutId);

    if (response && response.ok) {
        return { success: true, message: "Connected (Health Check)" };
    }

    // Try root as fallback
    const rootRes = await fetch(`${cleanUrl}/`, { method: 'GET' }).catch(() => null);
    if (rootRes && rootRes.ok) {
        return { success: true, message: "Connected (Root)" };
    }

    throw new Error("Server reachable but returned error");
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown connection error";
    // Check specifically for AbortError (timeout) or mixed content issues
    if (msg.includes('aborted')) return { success: false, message: "Connection Timed Out" };
    if (msg.includes('Failed to fetch')) return { success: false, message: "Network Error (CORS or Offline)" };
    
    return { success: false, message: msg };
  }
};

export const getProjectDownloadStatus = async (baseUrl: string, projectId: number): Promise<ProjectStatusResponse> => {
  const cleanUrl = baseUrl.replace(/\/$/, '');
  const response = await fetch(`${cleanUrl}/v2/projects/${projectId}/download-status`, {
      method: 'GET',
      headers: getHeaders()
  });
  return handleResponse<ProjectStatusResponse>(response);
};

export const batchProcessClips = async (baseUrl: string, projectId: number, clips: any[]): Promise<ClipProcessingResponse> => {
  const cleanUrl = baseUrl.replace(/\/$/, '');
  const response = await fetch(`${cleanUrl}/v2/projects/${projectId}/batch-clips`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ clips })
  });
  return handleResponse<ClipProcessingResponse>(response);
};

export const renderClip = async (baseUrl: string, payload: any): Promise<RenderClipResponse> => {
  const cleanUrl = baseUrl.replace(/\/$/, '');
  const response = await fetch(`${cleanUrl}/clips/render`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
  });
  return handleResponse<RenderClipResponse>(response);
};

export const checkClipStatus = async (baseUrl: string, clipId: string): Promise<ClipStatusResponse> => {
  const cleanUrl = baseUrl.replace(/\/$/, '');
  const response = await fetch(`${cleanUrl}/clips/status/${clipId}`, {
      method: 'GET',
      headers: getHeaders()
  });
  return handleResponse<ClipStatusResponse>(response);
};
