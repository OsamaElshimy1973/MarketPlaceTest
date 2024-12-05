import { User } from '../types';

interface LocationRecord {
  phoneNumber: string;
  latitude: number;
  longitude: number;
  timestamp: string;
}

class CsvService {
  private static instance: CsvService;
  private readonly fileName = 'locations.csv';

  private constructor() {
    this.initializeFile();
  }

  static getInstance(): CsvService {
    if (!CsvService.instance) {
      CsvService.instance = new CsvService();
    }
    return CsvService.instance;
  }

  private initializeFile(): void {
    if (!localStorage.getItem(this.fileName)) {
      localStorage.setItem(this.fileName, 'phoneNumber,latitude,longitude,timestamp\n');
    }
  }

  updateLocation(user: User, latitude: number, longitude: number): void {
    if (!user.phoneNumber) return;

    const records = this.readRecords();
    const timestamp = new Date().toISOString();
    const newRecord: LocationRecord = {
      phoneNumber: user.phoneNumber,
      latitude,
      longitude,
      timestamp,
    };

    const existingIndex = records.findIndex(r => r.phoneNumber === user.phoneNumber);
    if (existingIndex !== -1) {
      records[existingIndex] = newRecord;
    } else {
      records.push(newRecord);
    }

    this.saveRecords(records);
  }

  getAllLocations(): LocationRecord[] {
    return this.readRecords();
  }

  private readRecords(): LocationRecord[] {
    const csvContent = localStorage.getItem(this.fileName) || '';
    const lines = csvContent.split('\n').slice(1); // Skip header
    return lines
      .filter(line => line.trim())
      .map(line => {
        const [phoneNumber, latitude, longitude, timestamp] = line.split(',');
        return {
          phoneNumber,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          timestamp,
        };
      });
  }

  private saveRecords(records: LocationRecord[]): void {
    const header = 'phoneNumber,latitude,longitude,timestamp\n';
    const content = records
      .map(r => `${r.phoneNumber},${r.latitude},${r.longitude},${r.timestamp}`)
      .join('\n');
    localStorage.setItem(this.fileName, header + content + '\n');
  }
}

export const csvService = CsvService.getInstance();