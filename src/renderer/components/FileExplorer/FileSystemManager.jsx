import React, { useEffect, useState, useCallback, useRef } from "react";
// ... existing imports ...

// Import any UI components needed for notifications (if available in your codebase)
import { toast } from 'react-hot-toast'; // Assuming you use react-hot-toast for notifications

// ... existing code ...

export const FileSystemManager = React.memo(({ onFilesUpdate, ...props }) => {
  // ... existing state ...
  const [processingStatus, setProcessingStatus] = useState({ status: null, message: null });
  
  // ... existing code ...
  
  // Subscribe to file processing status updates
  useEffect(() => {
    // Setup listener for file processing status messages
    const handleFileProcessingStatus = (statusData) => {
      setProcessingStatus(statusData);
      
      // Display notifications for warnings and errors
      if (statusData.status === 'warning' || statusData.status === 'error') {
        toast[statusData.status === 'error' ? 'error' : 'warning'](
          statusData.message || 'An issue occurred while processing files'
        );
      }
    };
    
    window.electron.onFileProcessingStatus(handleFileProcessingStatus);
    
    return () => {
      // Clean up listener (if needed)
      // This depends on how your electron API is implemented
    };
  }, []);
  
  // ... existing code ...
  
  // You might want to display a status indicator somewhere in your UI based on processingStatus
  // Add this where appropriate in your render function
  
  return (
    <div className="file-explorer">
      {/* ... existing UI ... */}
      
      {processingStatus.status === 'warning' && (
        <div className="file-processing-warning">
          <span className="warning-icon">⚠️</span>
          <span className="warning-message">{processingStatus.message}</span>
        </div>
      )}
      
      {/* ... rest of your UI ... */}
    </div>
  );
}); 