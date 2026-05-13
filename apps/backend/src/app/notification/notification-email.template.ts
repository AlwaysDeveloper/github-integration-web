import { NotificationEntity } from '../database/entities/notification.entity';

export class NotificationEmailTemplate {
  static build(notification: NotificationEntity): {
    subject: string;
    html: string;
  } {
    return {
      subject: this.buildSubject(notification),
      html: this.renderHtml(notification),
    };
  }

  // ---------------- SUBJECT ----------------

  private static buildSubject(notification: NotificationEntity): string {
    const meta = notification.metadata || {};

    // Better GitHub-aware subject (if available)
    if (meta.pullRequestNumber) {
      return `🔔 PR #${meta.pullRequestNumber} ${meta.action || ''}`.trim();
    }

    return `🔔 ${notification.title}`;
  }

  // ---------------- HTML ----------------

  private static renderHtml(notification: NotificationEntity): string {
    const metadata = notification.metadata || {};

    const message = this.getMessage(notification);

    return `
    <div style="
      font-family: Arial, sans-serif;
      background: #f6f8fa;
      padding: 20px;
    ">

      <div style="
        max-width: 600px;
        margin: auto;
        background: #ffffff;
        padding: 20px;
        border-radius: 10px;
        border: 1px solid #e1e4e8;
      ">

        <!-- HEADER -->
        <h2 style="color: #24292e; margin-bottom: 10px;">
          🔔 ${this.escapeHtml(notification.title)}
        </h2>

        <p style="color: #586069; font-size: 13px;">
          User ID: ${notification.userId}
        </p>

        <p style="color: #586069; font-size: 13px;">
          Received: ${new Date(notification.createdAt).toLocaleString()}
        </p>

        <hr style="margin: 20px 0;" />

        <!-- MESSAGE -->
        <div style="font-size: 15px; color: #24292e;">
          ${this.escapeHtml(message)}
        </div>

        <!-- KEY DETAILS (SMART RENDER) -->
        ${this.renderKeyDetails(metadata)}

        <!-- FULL METADATA (COLLAPSIBLE DEBUG) -->
        ${this.renderMetadata(metadata)}

        <hr style="margin: 20px 0;" />

        <p style="
          font-size: 11px;
          color: #999;
          text-align: center;
        ">
          GitHub Integration Notification System
        </p>

      </div>
    </div>
    `;
  }

  // ---------------- MESSAGE ----------------

  private static getMessage(notification: NotificationEntity): string {
    const meta = notification.metadata || {};

    if (meta.title && meta.pullRequestNumber) {
      return `Pull Request #${meta.pullRequestNumber}: ${meta.title}`;
    }

    if (meta.action && meta.state) {
      return `PR ${meta.state} (${meta.action})`;
    }

    return notification.message || 'No message available';
  }

  // ---------------- SMART DETAILS ----------------

  private static renderKeyDetails(metadata: any): string {
    if (!metadata || Object.keys(metadata).length === 0) return '';

    const rows = [];

    if (metadata.htmlUrl) {
      rows.push(`
        <p>
          <a href="${metadata.htmlUrl}" target="_blank">
            🔗 View Pull Request
          </a>
        </p>
      `);
    }

    if (metadata.repositoryId) {
      rows.push(`<p>📦 Repo ID: ${metadata.githubRepositoryId}</p>`);
    }

    if (metadata.additions != null) {
      rows.push(
        `<p>➕ +${metadata.additions} / ➖ -${metadata.deletions}</p>`,
      );
    }

    return rows.length
      ? `
        <hr style="margin: 20px 0;" />
        <div style="font-size: 13px; color: #444;">
          ${rows.join('')}
        </div>
      `
      : '';
  }

  // ---------------- DEBUG METADATA ----------------

  private static renderMetadata(metadata: any): string {
    if (!metadata || Object.keys(metadata).length === 0) return '';

    return `
      <details style="margin-top: 20px;">
        <summary style="cursor: pointer; color: #888;">
          Raw Event Data
        </summary>

        <pre style="
          background: #f1f1f1;
          padding: 12px;
          border-radius: 6px;
          overflow-x: auto;
          font-size: 12px;
        ">
${JSON.stringify(metadata, null, 2)}
        </pre>
      </details>
    `;
  }

  // ---------------- UTIL ----------------

  private static escapeHtml(text?: string | null): string {
    if (!text) return '';

    return text
      .toString()
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}