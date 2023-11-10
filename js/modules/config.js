const RAFFLE_STATE = {
    ING: 'ING', // 추첨 참여 진행 중
    DEAD_LINE_COMPLETED: 'DEAD_LINE_COMPLETED', // 마감 완료
    FINISH: 'FINISH', // 추첨 완료
};

const oConfig = (() => {
    'use strict';

    let extensionSDK = null;

    return {
        init: () => {
            const SDK = window.AFREECA.ext;
            extensionSDK = SDK();

            extensionSDK.handleError((error) => {
                // 확장 프로그램을 불러오는 중 문제가 발생
                console.log(error);
            });
        },
        getExtensionSDK: () => {
            return extensionSDK;
        },
    };
})();

export {oConfig, RAFFLE_STATE};
