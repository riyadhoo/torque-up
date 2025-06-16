
export { useMessagesApi } from './useMessagesApi';
export { useConversations } from './useConversations';
export { useCurrentConversation } from './useCurrentConversation';

// Export utility functions for potential reuse
export { 
  fetchUserMessages, 
  fetchUserProfiles, 
  fetchUserInfo 
} from './utils/conversationQueries';
export { 
  processMessagesToConversations, 
  createNewConversation, 
  addTargetUserToConversations 
} from './utils/conversationProcessors';
export { 
  useTargetUserId, 
  handleEmptyConversations, 
  getUniqueUserIds 
} from './utils/conversationHelpers';
