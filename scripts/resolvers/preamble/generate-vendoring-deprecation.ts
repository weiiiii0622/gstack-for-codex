import type { TemplateContext } from '../types';
import { getHostConfig } from '../../../hosts/index';

export function generateVendoringDeprecation(ctx: TemplateContext): string {
  const hostConfig = getHostConfig(ctx.host);
  const vendoredRoot = hostConfig.vendoredSkillRoot || hostConfig.localSkillRoot;
  const instructionsFile = hostConfig.projectInstructionsFile || 'CLAUDE.md';
  const globalRoot = `~/${hostConfig.globalRoot}`;
  const hostDir = vendoredRoot.split('/')[0] || vendoredRoot;
  return `If \`VENDORED_GSTACK\` is \`yes\`, warn once via AskUserQuestion unless \`~/.gstack/.vendoring-warned-$SLUG\` exists:

> This project has gstack vendored in \`${vendoredRoot}/\`. Vendoring is deprecated.
> Migrate to team mode?

Options:
- A) Yes, migrate to team mode now
- B) No, I'll handle it myself

If A:
1. Run \`git rm -r ${vendoredRoot}/\`
2. Run \`echo '${vendoredRoot}/' >> .gitignore\`
3. Run \`${ctx.paths.binDir}/gstack-team-init required\` (or \`optional\`)
4. Run \`git add ${hostDir}/ .gitignore ${instructionsFile} && git commit -m "chore: migrate gstack from vendored to team mode"\`
5. Tell the user: "Done. Each developer now runs: \`cd ${globalRoot} && ./setup --team\`"

If B: say "OK, you're on your own to keep the vendored copy up to date."

Always run (regardless of choice):
\`\`\`bash
eval "$(${ctx.paths.binDir}/gstack-slug 2>/dev/null)" 2>/dev/null || true
touch ~/.gstack/.vendoring-warned-\${SLUG:-unknown}
\`\`\`

If marker exists, skip.`;
}
