import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as xml2js from 'xml2js';

@Injectable()
export class XmlImporterService {
  async importTercXml(db: any, xmlFile: Buffer): Promise<[number, number]> {
    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(xmlFile);
    let sCount = 0;
    let dCount = 0;

    const statesData: { [key: string]: string } = {};
    const districtsData: [string, string, string][] = [];

    for (const row of result.row) {
      const woj = this.clean(row.WOJ);
      const powiat = this.clean(row.POW);
      const gmina = this.clean(row.GMI);
      const nazwa = this.clean(row.NAZWA);

      if (!powiat && !gmina) {
        statesData[woj] = nazwa.capitalize();
      } else if (woj && powiat && !gmina) {
        districtsData.push([woj, powiat, nazwa]);
      }

      row.clear();
    }

    const stateMap: { [key: string]: number } = {};
    for (const [tCode, name] of Object.entries(statesData)) {
      const state = await db.query(models.LocationState).findOne({ where: { teryt_code: tCode } });
      if (!state) {
        state = new models.LocationState(name, tCode);
        db.save(state);
        sCount++;
      }
      stateMap[tCode] = state.id;
    }

    for (const [wojCode, powCode, name] of districtsData) {
      const stateId = stateMap[wojCode];
      if (!stateId) {
        // Może województwo już było w bazie wcześniej?
        const state = await db.query(models.LocationState).findOne({ where: { teryt_code: wojCode } });
        if (state) {
          stateId = state.id;
          stateMap[wojCode] = stateId;
        } else {
          continue;
        }
      }

      const exist = await db.query(models.LocationDistrict).findOne({
        where: [
          { state_id: stateId },
          { teryt_code: powCode }
        ]
      });

      if (!exist) {
        db.save(new models.LocationDistrict(state_id, name, powCode));
        dCount++;
      }

      if (dCount % 500 === 0) {
        await db.flush();
      }
    }

    await db.commit();
    return [sCount, dCount];
  }

  async importSimcXml(db: any, xmlFile: Buffer): Promise<number> {
    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(xmlFile);
    let count = 0;

    const distCache: { [key: string]: number } = {};
    const allDistricts = db.query(models.LocationDistrict).join(models.LocationState).all();
    for (const district of allDistricts) {
      distCache[[district.state.teryt_code, district.teryt_code]] = district.id;
    }

    for (const row of result.row) {
      const woj = this.clean(row.WOJ);
      const powiat = this.clean(row.POW);
      const gmi = this.clean(row.GMI);
      const rodz = this.clean(row.RODZ_GMI) || this.clean(row.RODZ);
      const nazwa = this.clean(row.NAZWA);
      const sym = this.clean(row.SYM);

      if (all([woj, powiat, nazwa, sym])) {
        const distId = distCache[[woj, powiat]];
        if (distId) {
          const city = await db.query(models.LocationCity).findOne({ where: { teryt_code: sym } });
          if (!city) {
            db.save(new models.LocationCity(
              district_id: distId,
              name: nazwa,
              teryt_code: sym,
              commune_code: gmi,
              commune_type: rodz
            ));
            count++;
            if (count % 500 === 0) {
              await db.flush();
            }
          }
        }
      }

      row.clear();
    }

    await db.commit();
    return count;
  }

  async importUlicXml(db: any, xmlFile: Buffer): Promise<number> {
    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(xmlFile);
    let count = 0;

    // Cache miast (SIMC)
    const cityCache: { [key: string]: number } = {};
    const allCities = db.query(models.LocationCity.id, models.LocationCity.teryt_code).all();
    for (const city of allCities) {
      cityCache[city.sym] = city.id;
    }

    for (const row of result.row) {
      const sym = this.clean(row.SYM); // SIMC miasta
      const cecha = this.clean(row.CECHA); // np. ul., al., pl.
      const nazwa1 = this.clean(row.NAZWA_1);
      const nazwa2 = this.clean(row.NAZWA_2) || "";
      const ulic = this.clean(row.SYM_UL); // Kod ulicy

      if (all([sym, nazwa1, ulic])) {
        const cityId = cityCache[sym];
        if (cityId) {
          const full_name = `${cecha} ${nazwa2} ${nazwa1}`.trim().replace("  ", " ");

          // Sprawdzamy po ULIC w obrębie miasta
          const exist = await db.query(models.LocationStreet).findOne({
            where: [
              { city_id: cityId },
              { teryt_code: ulic }
            ]
          });

          if (!exist) {
            db.save(new models.LocationStreet(
              city_id: cityId,
              name: full_name,
              teryt_code: ulic
            ));
            count++;
            if (count % 1000 === 0) {
              await db.flush();
            }
          }
        }
      }

      row.clear();
    }

    await db.commit();
    return count;
  }

  private clean(value: string | null): string | null {
    if (!value) return null;
    const v = value.trim();
    return v ? v : null;
  }
}
