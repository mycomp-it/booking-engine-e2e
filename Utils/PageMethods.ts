import { Page } from '@playwright/test';

const waitForLoadState = async (page: Page) => {
    await page.waitForLoadState('networkidle');
};

function formatDateTime(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function formatToIsoDate(date: Date): string {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${date.getFullYear()}-${month}-${day}`;
}

function generateRandom4DigitNumber() {
    return Math.floor(1000 + Math.random() * 9000);
}

function generateRandomBirthDate(minAge: number = 18, maxAge: number = 80): Date {
    const today = new Date();
    const maxBirthDate = new Date(today);
    maxBirthDate.setFullYear(today.getFullYear() - minAge);
    const minBirthDate = new Date(today);
    minBirthDate.setFullYear(today.getFullYear() - maxAge);
    const minTime = minBirthDate.getTime();
    const maxTime = maxBirthDate.getTime();
    const randomTime = minTime + Math.random() * (maxTime - minTime);
    return new Date(randomTime);
}

function formatToDDMMYYYY(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

function getTomorrowDate(): Date {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    return tomorrow;
}

export { waitForLoadState, formatDateTime, generateRandom4DigitNumber, formatToIsoDate, generateRandomBirthDate, formatToDDMMYYYY, getTomorrowDate };
