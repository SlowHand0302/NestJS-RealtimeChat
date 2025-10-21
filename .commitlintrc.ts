import type { UserConfig } from '@commitlint/types';
import { RuleConfigSeverity } from '@commitlint/types';

const Configuration: UserConfig = {
    extends: ['@commitlint/config-conventional'],
    formatter: '@commitlint/format',
    rules: {
        'type-enum': [
            RuleConfigSeverity.Error,
            'always',
            [
                'feat', // New feature
                'fix', // Bug fix
                'docs', // Documentation changes
                'style', // Code style changes (formatting, etc.)
                'refactor', // Code refactoring
                'perf', // Performance improvements
                'test', // Adding or updating tests
                'chore', // Maintenance tasks
                'ci', // CI/CD changes
                'build', // Build system changes
                'revert', // Reverting previous commits
            ],
        ],
        'type-case': [RuleConfigSeverity.Error, 'always', 'lower-case'],
        'type-empty': [RuleConfigSeverity.Error, 'never'],
        'scope-empty': [RuleConfigSeverity.Error, 'never'],
        'subject-empty': [RuleConfigSeverity.Error, 'never'],
        'subject-full-stop': [RuleConfigSeverity.Error, 'never', '.'],
        'header-max-length': [RuleConfigSeverity.Error, 'always', 100],
    },
};

export default Configuration;
