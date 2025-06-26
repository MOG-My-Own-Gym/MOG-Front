import { useEffect } from 'react';
import { Container, Alert, Fade } from 'react-bootstrap';

export default function Toast({ isToast, content }) {
  return (
    <>
      <Container
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          maxWidth: '100%',
          width: '100%',
          height: '100%',
          position: 'fixed',
          backgroundColor: 'transparent',
          zIndex: 100,
          pointerEvents: 'none',
        }}
      >
        <Fade in={isToast}>
          <div>
            <Alert variant="secondary" style={{ width: '50em', height: '10em', opacity: '0.7' }}>
              <Alert.Heading style={{ display: 'flex', justifyContent: 'center', opacity: '1' }}>
                Toast
              </Alert.Heading>
              <Container style={{ display: 'flex', justifyContent: 'center', opacity: '1' }}>
                {content}
              </Container>
            </Alert>
          </div>
        </Fade>
      </Container>
    </>
  );
}
