/**
 * @typedef {'low'|'medium'|'high'} RiskLevel
 * @typedef {'violation'|'risky'|'needs_review'|'pass'} Verdict
 * @typedef {'video'|'photo'|'caption'} IssueSource
 *
 * @typedef {Object} Issue
 * @property {string} id
 * @property {string} claimText
 * @property {IssueSource} source
 * @property {number} [timestampSeconds]
 * @property {Verdict} verdict
 * @property {RiskLevel} severity
 * @property {string} ruleId
 * @property {string} ruleName
 * @property {string} ruleText - SAMPLE TEXT: not real legal advice
 * @property {string} explanation
 * @property {string} [suggestedRewrite]
 *
 * @typedef {Object} ReportSummary
 * @property {number} violations
 * @property {number} risky
 * @property {number} passed
 *
 * @typedef {Object} AnalysisReport
 * @property {string} id
 * @property {string} createdAt - ISO string
 * @property {string} category
 * @property {RiskLevel} overallRisk
 * @property {number} score - 0-100, higher = more risky
 * @property {ReportSummary} summary
 * @property {Issue[]} issues
 * @property {boolean} isInfluencer
 * @property {string} [caption]
 */
export {};
