import { Close, Language, OpenInNew } from '@mui/icons-material';
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  Link,
  List,
  ListItem,
  Typography
} from '@mui/material';

const SourcesPanel = ({ open, onClose, sources }) => {
  // Process and deduplicate sources
  const processedSources = sources ? sources.reduce((acc, source) => {
    if (source && source.name && source.link) {
      // Check if we already have this source (by name and link)
      const exists = acc.find(existing => 
        existing.name === source.name && existing.link === source.link
      );
      if (!exists) {
        acc.push(source);
      }
    }
    return acc;
  }, []) : [];

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: '35vw',
          maxWidth: '35vw'
        }
      }}
    >
          {/* Sticky Header */}
          <Box sx={{ 
            p: 3, 
            flexShrink: 0, 
            position: 'sticky', 
            top: 0, 
            zIndex: 20, 
            background: 'linear-gradient(#fff,#fff)',
            borderBottom: '1px solid #e0e0e0'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Sources ({processedSources.length})
              </Typography>
              <IconButton onClick={onClose} size="small" sx={{ ml: 1 }}>
                <Close />
              </IconButton>
            </Box>
          </Box>

          {/* Scrollable Content */}
          <Box sx={{ p: 3, pt: 2, flex: 1, overflowY: 'auto' }}>
            {processedSources.length === 0 ? (
              <Typography variant="body2" sx={{ color: '#666', textAlign: 'center', mt: 4 }}>
                No sources available
              </Typography>
            ) : (
              <>
                {/* Sources List */}
                <List sx={{ p: 0 }}>
                  {processedSources.map((source, index) => (
                    <Box key={index}>
                      <ListItem sx={{ px: 0, py: 2, alignItems: 'flex-start' }}>
                        <Box sx={{ width: '100%' }}>
                          {/* Source Icon & Name */}
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Language sx={{ fontSize: 16, color: '#666' }} />
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, flex: 1 }}>
                              {source.name}
                            </Typography>
                          </Box>

                          {/* Description (if available) */}
                          {source.description && (
                            <Typography variant="body2" sx={{ color: '#666', mb: 2, lineHeight: 1.5 }}>
                              {source.description}
                            </Typography>
                          )}

                          {/* Link */}
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Link
                              href={source.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                                color: '#3289C9',
                                textDecoration: 'none',
                                fontSize: '0.875rem',
                                '&:hover': { textDecoration: 'underline' }
                              }}
                            >
                              Visit Source
                              <OpenInNew sx={{ fontSize: 14 }} />
                            </Link>
                          </Box>
                        </Box>
                      </ListItem>
                      {index < processedSources.length - 1 && <Divider />}
                    </Box>
                  ))}
                </List>

                {/* Footer Note */}
                <Box sx={{ mt: 4, p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                  <Typography variant="caption" sx={{ color: '#666', lineHeight: 1.4 }}>
                    These sources provide additional information and official guidance. Always verify current requirements with official sources.
                  </Typography>
                </Box>
              </>
            )}
          </Box>
    </Drawer>
  );
};

export default SourcesPanel;