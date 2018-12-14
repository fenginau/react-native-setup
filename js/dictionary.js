import I18n from '../js/i18n';
export default {
    region: {
        'VIC': {
            'MEL': 'Melbourne',
            'GEX': 'Geelong',
        },
        'NSW': {
            'SYD': 'Sydney',
            'NEWC': 'Newcastle',
        }
    },
    interest: {
        0: 'A',
        1: 'B',
        2: 'C',
        3: 'D',
        4: 'E',
        5: 'F',
        6: 'G',
        7: 'H',
        8: 'I',
        9: 'J',
    },
    rsaKeyType: {
        'ClientPublic': 1,
        'ClientPrivate': 2,
        'ServerPublic': 3,
    },
    errorMsg: {
        'AccountNotEmpty': I18n.t('accountNotEmpty'),
        'PasswordNotEmpty': I18n.t('passwordNotEmpty'),
        'UserNotFound': I18n.t('userNotFound'),
        'PasswordNotCorrect': I18n.t('passwordNotCorrect'),
    }
}