export const COUPON_CODE = {
    FRIDAY:"FRIDAY",
    XMAS2021:"XMAS2021",
    NY2022:"NY2022"
} as const;

export type CouponeCode = keyof typeof COUPON_CODE;
