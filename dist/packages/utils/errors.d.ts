export const __esModule: boolean;
export namespace SDK_ERRORS {
    namespace INVALID_METHOD {
        let message: string;
        let code: number;
    }
    namespace INVALID_EVENT {
        let message_1: string;
        export { message_1 as message };
        let code_1: number;
        export { code_1 as code };
    }
    namespace INVALID_UPDATE_REQUEST {
        let message_2: string;
        export { message_2 as message };
        let code_2: number;
        export { code_2 as code };
    }
    namespace INVALID_EXTEND_REQUEST {
        let message_3: string;
        export { message_3 as message };
        let code_3: number;
        export { code_3 as code };
    }
    namespace INVALID_SESSION_SETTLE_REQUEST {
        let message_4: string;
        export { message_4 as message };
        let code_4: number;
        export { code_4 as code };
    }
    namespace UNAUTHORIZED_METHOD {
        let message_5: string;
        export { message_5 as message };
        let code_5: number;
        export { code_5 as code };
    }
    namespace UNAUTHORIZED_EVENT {
        let message_6: string;
        export { message_6 as message };
        let code_6: number;
        export { code_6 as code };
    }
    namespace UNAUTHORIZED_UPDATE_REQUEST {
        let message_7: string;
        export { message_7 as message };
        let code_7: number;
        export { code_7 as code };
    }
    namespace UNAUTHORIZED_EXTEND_REQUEST {
        let message_8: string;
        export { message_8 as message };
        let code_8: number;
        export { code_8 as code };
    }
    namespace USER_REJECTED {
        let message_9: string;
        export { message_9 as message };
        let code_9: number;
        export { code_9 as code };
    }
    namespace USER_REJECTED_CHAINS {
        let message_10: string;
        export { message_10 as message };
        let code_10: number;
        export { code_10 as code };
    }
    namespace USER_REJECTED_METHODS {
        let message_11: string;
        export { message_11 as message };
        let code_11: number;
        export { code_11 as code };
    }
    namespace USER_REJECTED_EVENTS {
        let message_12: string;
        export { message_12 as message };
        let code_12: number;
        export { code_12 as code };
    }
    namespace UNSUPPORTED_CHAINS {
        let message_13: string;
        export { message_13 as message };
        let code_13: number;
        export { code_13 as code };
    }
    namespace UNSUPPORTED_METHODS {
        let message_14: string;
        export { message_14 as message };
        let code_14: number;
        export { code_14 as code };
    }
    namespace UNSUPPORTED_EVENTS {
        let message_15: string;
        export { message_15 as message };
        let code_15: number;
        export { code_15 as code };
    }
    namespace UNSUPPORTED_ACCOUNTS {
        let message_16: string;
        export { message_16 as message };
        let code_16: number;
        export { code_16 as code };
    }
    namespace UNSUPPORTED_NAMESPACE_KEY {
        let message_17: string;
        export { message_17 as message };
        let code_17: number;
        export { code_17 as code };
    }
    namespace USER_DISCONNECTED {
        let message_18: string;
        export { message_18 as message };
        let code_18: number;
        export { code_18 as code };
    }
    namespace SESSION_SETTLEMENT_FAILED {
        let message_19: string;
        export { message_19 as message };
        let code_19: number;
        export { code_19 as code };
    }
    namespace WC_METHOD_UNSUPPORTED {
        let message_20: string;
        export { message_20 as message };
        let code_20: number;
        export { code_20 as code };
    }
}
export namespace INTERNAL_ERRORS {
    namespace NOT_INITIALIZED {
        let message_21: string;
        export { message_21 as message };
        let code_21: number;
        export { code_21 as code };
    }
    namespace NO_MATCHING_KEY {
        let message_22: string;
        export { message_22 as message };
        let code_22: number;
        export { code_22 as code };
    }
    namespace RESTORE_WILL_OVERRIDE {
        let message_23: string;
        export { message_23 as message };
        let code_23: number;
        export { code_23 as code };
    }
    namespace RESUBSCRIBED {
        let message_24: string;
        export { message_24 as message };
        let code_24: number;
        export { code_24 as code };
    }
    namespace MISSING_OR_INVALID {
        let message_25: string;
        export { message_25 as message };
        let code_25: number;
        export { code_25 as code };
    }
    namespace EXPIRED {
        let message_26: string;
        export { message_26 as message };
        let code_26: number;
        export { code_26 as code };
    }
    namespace UNKNOWN_TYPE {
        let message_27: string;
        export { message_27 as message };
        let code_27: number;
        export { code_27 as code };
    }
    namespace MISMATCHED_TOPIC {
        let message_28: string;
        export { message_28 as message };
        let code_28: number;
        export { code_28 as code };
    }
    namespace NON_CONFORMING_NAMESPACES {
        let message_29: string;
        export { message_29 as message };
        let code_29: number;
        export { code_29 as code };
    }
}
/**
 * Utilities
 */
export function getInternalError(key: any, context: any): {
    message: any;
    code: any;
};
export function getSdkError(key: any, context: any): {
    message: any;
    code: any;
};
