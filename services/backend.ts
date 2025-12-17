
export interface BackendResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
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
    status?: string;
  }
}

export interface ClipProcessingResponse extends BackendResponse {
  data: {
    estimatedTime: string;
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

const handleResponse = async (response: Response) => {
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || data.error || `Request failed with status ${response.status}`);
    }
    return data;
  } else {
     if (!response.ok) {
        throw new Error(response.statusText || `Request failed with status ${response.status}`);
     }
     return { success: true, message: "Success", data: {} }; 
  }
};

// V2: Create Project (Downloads video)
export const createProject = async (
  baseUrl: string, 
  youtubeUrl: string, 
  title: string = 'New Project', 
  quality: string = '720p',
  downloader: string = 'auto'
): Promise<CreateProjectResponse> => {
  try {
    const cleanUrl = baseUrl.replace(/\/$/, '');
    const response = await fetch(`${cleanUrl}/v2/projects`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        title,
        youtubeUrl,
        userId: 1, 
        quality: quality,
        downloader: downloader 
      })
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Create Project Error:", error);
    throw error;
  }
};

export const testBackendConnection = async (baseUrl: string): Promise<{ success: boolean; message: string }> => {
  try {
    const cleanUrl = baseUrl.replace(/\/$/, '');
    const response = await fetch(`${cleanUrl}/health`, { 
        method: 'GET',
        headers: getHeaders()
    }).catch(() => null);

    if (response && response.ok) {
        return { success: true, message: "Connected" };
    }

    // Try root as fallback
    const rootRes = await fetch(`${cleanUrl}/`, { method: 'GET' }).catch(() => null);
    if (rootRes && rootRes.ok) {
        return { success: true, message: "Connected (Root)" };
    }

    throw new Error("Connection failed");
  } catch (error) {
    return { success: false, message: (error as Error).message || "Connection Failed" };
  }
};

export const getProjectDownloadStatus = async (baseUrl: string, projectId: number): Promise<ProjectStatusResponse> => {
  try {
    const cleanUrl = baseUrl.replace(/\/$/, '');
    // Corrected endpoint: /v2/projects/:id/download-status
    const response = await fetch(`${cleanUrl}/v2/projects/${projectId}/download-status`, {
        method: 'GET',
        headers: getHeaders()
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Get Status Error:", error);
    throw error;
  }
};

export const batchProcessClips = async (baseUrl: string, projectId: number, clips: any[]): Promise<ClipProcessingResponse> => {
  try {
    const cleanUrl = baseUrl.replace(/\/$/, '');
    // Corrected endpoint: /v2/projects/:id/batch-clips
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

export const renderClip = async (baseUrl: string, payload: any): Promise<RenderClipResponse> => {
  try {
    const cleanUrl = baseUrl.replace(/\/$/, '');
    // Corrected endpoint: /clips/render
    const response = await fetch(`${cleanUrl}/clips/render`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload)
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Render Clip Error:", error);
    throw error;
  }
};

export const checkClipStatus = async (baseUrl: string, clipId: string): Promise<ClipStatusResponse> => {
  try {
    const cleanUrl = baseUrl.replace(/\/$/, '');
    // Corrected endpoint: /clips/status/:clipId
    const response = await fetch(`${cleanUrl}/clips/status/${clipId}`, {
        method: 'GET',
        headers: getHeaders()
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Check Clip Status Error:", error);
    throw error;
  }
};
