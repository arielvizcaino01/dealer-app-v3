import { chromium } from 'playwright';

export type CopartVehicleData = {
  lotNumber: string;
  vin: string;
  year: number | null;
  make: string;
  model: string;
  miles: number | null;
  primaryDamage: string | null;
  secondaryDamage: string | null;
  fuelType: string | null;
  engine: string | null;
  photos: string[];
};

function extractLotFromUrl(url: string): string | null {
  const match = url.match(/\/lot\/(\d+)/i);
  return match ? match[1] : null;
}

function parseNumber(text: string | null | undefined): number | null {
  if (!text) return null;
  const clean = text.replace(/[^\d]/g, '');
  return clean ? Number(clean) : null;
}

export async function extractCopartData(url: string): Promise<CopartVehicleData> {
  const browser = await chromium.launch({
    headless: true,
  });

  const page = await browser.newPage({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  });

  try {
    // Timeout general más corto para que no se quede colgado
    page.setDefaultTimeout(15000);

    console.log('Abriendo URL de Copart:', url);

    await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 15000,
    });

    // Espera corta, pero NO bloqueante
    await page.waitForTimeout(3000);

    const lotNumber =
      extractLotFromUrl(url) ||
      (await page
        .locator('[data-uname="lotdetailLotnumbervalue"]')
        .first()
        .textContent()
        .catch(() => null)) ||
      '';

    const vin =
      (await page
        .locator('[data-uname="lotdetailVinvalue"]')
        .first()
        .textContent()
        .catch(() => null)) ||
      '';

    const titleText = (await page.title().catch(() => '')) || '';
    const titleParts = titleText.trim().split(/\s+/);

    const yearMatch = titleText.match(/\b(19|20)\d{2}\b/);
    const year = yearMatch ? Number(yearMatch[0]) : null;

    let make = '';
    let model = '';

    if (year && titleParts.length >= 3) {
      const yearIndex = titleParts.findIndex((part) => part === String(year));
      if (yearIndex !== -1) {
        make = titleParts[yearIndex + 1] || '';
        model = titleParts[yearIndex + 2] || '';
      }
    }

    const milesText =
      (await page
        .locator('[data-uname="lotdetailOdometervalue"]')
        .first()
        .textContent()
        .catch(() => null)) ||
      '';

    const primaryDamage =
      (await page
        .locator('[data-uname="lotdetailPrimarydamagevalue"]')
        .first()
        .textContent()
        .catch(() => null)) ||
      null;

    const secondaryDamage =
      (await page
        .locator('[data-uname="lotdetailSecondarydamagevalue"]')
        .first()
        .textContent()
        .catch(() => null)) ||
      null;

    const fuelType =
      (await page
        .locator('[data-uname="lotdetailFueltypevalue"]')
        .first()
        .textContent()
        .catch(() => null)) ||
      null;

    const engine =
      (await page
        .locator('[data-uname="lotdetailEnginevalue"]')
        .first()
        .textContent()
        .catch(() => null)) ||
      null;

    const imageUrls = await page.evaluate(() => {
      const urls = new Set<string>();

      document.querySelectorAll('img').forEach((img) => {
        const src = img.getAttribute('src');
        if (src && (src.includes('copart') || src.includes('image'))) {
          urls.add(src);
        }
      });

      return Array.from(urls);
    });

    console.log('Copart extraído:', {
      lotNumber,
      vin,
      year,
      make,
      model,
      photos: imageUrls.length,
    });

    return {
      lotNumber: String(lotNumber).trim(),
      vin: String(vin).trim(),
      year,
      make: make.trim(),
      model: model.trim(),
      miles: parseNumber(milesText),
      primaryDamage: primaryDamage ? String(primaryDamage).trim() : null,
      secondaryDamage: secondaryDamage ? String(secondaryDamage).trim() : null,
      fuelType: fuelType ? String(fuelType).trim() : null,
      engine: engine ? String(engine).trim() : null,
      photos: imageUrls.slice(0, 30),
    };
  } catch (error) {
    console.error('Error dentro de Playwright/Copart:', error);
    throw new Error('No se pudo extraer la información de Copart');
  } finally {
    await page.close().catch(() => {});
    await browser.close().catch(() => {});
  }
}