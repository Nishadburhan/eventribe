const getOrganizerEmailTemplate = (organizerName, eventName, attendeeName) => `
  <h1>New Registration for ${eventName}</h1>
  <p>Dear ${organizerName},</p>
  <p>${attendeeName} has just registered for your event.</p>
`;

const getAttendeeEmailTemplate = (attendeeName, eventName, organizerName) => `
  <h1>Registration Confirmation for ${eventName}</h1>
  <p>Dear ${attendeeName},</p>
  <p>You have successfully registered for the event ${eventName}, organized by ${organizerName}.</p>
`;

module.exports = {
  getOrganizerEmailTemplate,
  getAttendeeEmailTemplate,
};
