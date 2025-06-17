// Track events for both Google Analytics and Facebook Pixel
export const trackEvent = (eventName: string, eventData: any = {}) => {
  // Google Analytics tracking
  if (typeof window !== 'undefined' && (window as any).dataLayer) {
    (window as any).dataLayer.push({
      event: eventName,
      ...eventData,
    });
  }

  // Facebook Pixel tracking
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', eventName, eventData);
  }
};

// Predefined tracking events
export const trackCTAClick = (buttonName: string, location: string) => {
  trackEvent('cta_click', {
    button_name: buttonName,
    page_location: location,
  });
};

export const trackFormSubmission = (formType: string) => {
  trackEvent('form_submission', {
    form_type: formType,
  });
};

export const trackInvitationCreate = (templateId: string) => {
  trackEvent('invitation_created', {
    template_id: templateId,
  });
};

export const trackRSVP = (invitationId: string, response: 'yes' | 'no') => {
  trackEvent('rsvp_submitted', {
    invitation_id: invitationId,
    response: response,
  });
};
