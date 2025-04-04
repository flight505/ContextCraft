import React, { useCallback } from 'react';
import { Dialog } from './ui/Dialog';
import { Button } from './ui/Button';
import { ExternalLink } from 'lucide-react';
import styles from './GuideModal.module.css';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * In-app help component that provides basic usage information
 * and links to the full GitHub wiki documentation
 */
const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  // Define a handler for opening the wiki in an external browser
  const _handleOpenWiki = useCallback(() => { // Prefix with underscore to indicate intentionally unused
    // Only available in Electron environment
    if (window.electron?.openExternal) {
      window.electron.openExternal('https://github.com/flight505/ContextCraft/wiki');
    } else {
      // Fallback for non-Electron environments
      window.open('https://github.com/flight505/ContextCraft/wiki', '_blank', 'noopener,noreferrer');
    }
  }, []);

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="ContextCraft Guide"
      size="md"
    >
      <div className={styles.guideContent}>
        <h2 className={styles.sectionTitle}>Quick Start</h2>
        <ol className={styles.guideList}>
          <li>Click <strong>Select Folder</strong> to choose your project directory</li>
          <li>Select files you want to include in your code export</li>
          <li>Configure output options in the right panel</li>
          <li>Click <strong>Copy</strong> to copy formatted code to clipboard</li>
        </ol>

        <h2 className={styles.sectionTitle}>Key Features</h2>
        <ul className={styles.guideList}>
          <li><strong>File Selection:</strong> Choose specific files from your project</li>
          <li><strong>File Tree Generation:</strong> Include project structure in various formats</li>
          <li><strong>Token Counting:</strong> Track token usage for your chosen AI model</li>
          <li><strong>Code Compression:</strong> Reduce token usage by simplifying function bodies</li>
          <li><strong>Custom Instructions:</strong> Add specific questions or context for the AI</li>
        </ul>

        <h2 className={styles.sectionTitle}>Common Actions</h2>
        <ul className={styles.guideList}>
          <li><strong>Folder Selection:</strong> Clicking a folder checkbox selects all applicable files within it.</li>
          <li><strong>Ignore Patterns:</strong> Configure which files to exclude from the project view</li>
          <li><strong>Model Selection:</strong> Choose your target AI model to optimize token usage</li>
          <li><strong>Output Formatting:</strong> Select from XML, Markdown, or Plain Text formats</li>
        </ul>

        <div className={styles.wikiSection}>
          <h2 className={styles.sectionTitle}>Complete Documentation</h2>
          <p>For detailed instructions documentation and ideas on VibeCoding, visit the Wiki:</p>
          <Button 
            onClick={_handleOpenWiki}
            variant="primary"
            className={styles.wikiButton}
            endIcon={<ExternalLink size={16} />}
          >
            Open ContextCraft Wiki
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default GuideModal; 