/**
 * BeautyMaster — Message Templates
 *
 * Default outreach message templates, seeded in code so the feature works
 * before anyone configures a "Messages" sheet tab. Once a Messages tab URL
 * is set (see useCsvPolling.js), rows parsed from that sheet fully replace
 * this list, so non-engineers can edit wording / add templates without a
 * code deploy.
 */

import { ALERT_FLAGS } from './schema.js';

export const MESSAGE_TRACKS = Object.freeze({
  AUTO: 'auto',
  MANUAL: 'manual',
});

/** Synthetic trigger — not a persisted ALERT_FLAGS value, computed client-side from scheduledTime. */
export const TOMORROW_VISIT_TRIGGER = 'tomorrow-visit';

/**
 * @typedef {Object} MessageTemplate
 * @property {string} id
 * @property {string} label
 * @property {'auto'|'manual'} track
 * @property {string|null} triggerFlag - An ALERT_FLAGS value, TOMORROW_VISIT_TRIGGER, or null for manual templates
 * @property {string} body - Plain text with {{fullName}} / {{store}} / {{email}} / {{scheduledTime}} / {{requestedDate}} / {{month}} / {{tier}} / {{platform}} placeholders
 */

/** @type {MessageTemplate[]} */
export const DEFAULT_MESSAGE_TEMPLATES = [
  {
    id: 'no-show',
    label: 'No-show follow up',
    track: MESSAGE_TRACKS.AUTO,
    triggerFlag: ALERT_FLAGS.NO_SHOW_UNRESOLVED,
    body: "Hi! We noticed that you were scheduled to visit on {{scheduledTime}}, but it looks like you weren't able to make it. Would you like us to reschedule your visit? Let us know what date works best for you!",
  },
  {
    id: 'invite',
    label: 'Collaboration invite',
    track: MESSAGE_TRACKS.MANUAL,
    triggerFlag: null,
    body: "Hi! This is Beauty Master. We'd love to invite you to collaborate with us for the opening of our new {{store}} store. We've sent all the details to your email. If you didn't receive it, please let us know, and we'd be happy to send it again. Thank you, and we look forward to hearing from you!",
  },
  {
    id: 'agreement-not-completed',
    label: 'Agreement not completed',
    track: MESSAGE_TRACKS.MANUAL,
    triggerFlag: null,
    body: 'Hi! Before your visit, please complete the agreement form we sent to your email. Once it\'s completed, you\'ll be all set for your visit. Thank you!',
  },
  {
    id: 'reschedule-confirm',
    label: 'Reschedule confirmed',
    track: MESSAGE_TRACKS.AUTO,
    triggerFlag: ALERT_FLAGS.RESCHEDULE_PENDING,
    body: 'No problem! We can update your visit to {{requestedDate}}.\n\nSee you then!',
  },
  {
    id: 'negotiation-decline',
    label: 'Budget increase decline',
    track: MESSAGE_TRACKS.MANUAL,
    triggerFlag: null,
    body: "Thank you so much for letting us know! We completely understand.\nAt the moment, our budget for this collaboration is fixed, so we're unfortunately not able to increase the compensation. We'd still love to work with you if this opportunity is a good fit, but we completely understand if it doesn't work for you at this time.\nWe truly appreciate your interest and hope we can collaborate on a future campaign with a larger budget.",
  },
  {
    id: 'resend-invite',
    label: 'Resend invite email',
    track: MESSAGE_TRACKS.MANUAL,
    triggerFlag: null,
    body: "Hi! I sent it to {{email}}. Please check your inbox, and if you don't see it within about 10 minutes, please check your spam folder as well. Thanks!",
  },
  {
    id: 'day-before-reminder',
    label: 'Day-before reminder',
    track: MESSAGE_TRACKS.AUTO,
    triggerFlag: TOMORROW_VISIT_TRIGGER,
    body: "Hi! Just a friendly reminder that your Beauty Master visit is scheduled for tomorrow. When you arrive, please let our manager or staff know you're here for the collaboration, and they'll guide you from there. See you tomorrow!",
  },
  {
    id: 'content-upload-reminder',
    label: 'Content upload reminder',
    track: MESSAGE_TRACKS.AUTO,
    triggerFlag: ALERT_FLAGS.ATTEND_NO_COLLABO,
    body: "Hi! We hope you enjoyed your visit.\n\nJust a friendly reminder to share your content when you have a chance. Please let us know once it's posted. We can't wait to see it!",
  },
  {
    id: 'collab-tag-request',
    label: 'Collaborator tag request',
    track: MESSAGE_TRACKS.MANUAL,
    triggerFlag: null,
    body: 'Hi! Thank you so much for sharing your content!\nWould you mind adding Beauty Master as a collaborator on your post? That way, we can share the post together.\nThank you so much!',
  },
  {
    id: 'credit-send',
    label: 'Send credit',
    track: MESSAGE_TRACKS.AUTO,
    triggerFlag: ALERT_FLAGS.COLLABO_NO_CREDIT,
    body: 'Hi there,\nThank you for creating the content for us. As a token of our appreciation, we’re delighted to offer you a store credit.\nPlease note that this coupon is a one-time-only offer and can only be used at the {{store}} location.\nIf you have any questions or concerns, don’t hesitate to reach out to us.',
  },
];

/**
 * Visit is scheduled for the next calendar day (relative to `today`).
 *
 * @param {Date|null} scheduledTime
 * @param {Date} [today] - Injection point for testing; defaults to new Date()
 * @returns {boolean}
 */
export function isVisitTomorrow(scheduledTime, today = new Date()) {
  if (!scheduledTime) return false;
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const tomorrowStart = new Date(todayStart);
  tomorrowStart.setDate(tomorrowStart.getDate() + 1);
  const scheduledDay = new Date(scheduledTime.getFullYear(), scheduledTime.getMonth(), scheduledTime.getDate());
  return scheduledDay.getTime() === tomorrowStart.getTime();
}

/**
 * Templates whose trigger condition currently matches this influencer's state.
 *
 * @param {MessageTemplate[]} templates
 * @param {Influencer} influencer
 * @returns {MessageTemplate[]}
 */
export function matchSuggestedTemplates(templates, influencer) {
  const { alertFlags = [], scheduledTime = null } = influencer;
  return templates.filter(t => {
    if (t.track !== MESSAGE_TRACKS.AUTO || !t.triggerFlag) return false;
    if (t.triggerFlag === TOMORROW_VISIT_TRIGGER) return isVisitTomorrow(scheduledTime);
    return alertFlags.includes(t.triggerFlag);
  });
}
