const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Product = require('./models/Product');
const User = require('./models/User');

const products = [
  {
    name: 'ESP32-S3 Dual Core WiFi BLE Development Board',
    sku: 'EEKAI-MCU-ESP32S3',
    vendor: 'Espressif Systems',
    collection: 'Microcontrollers',
    description: 'The ESP32-S3 is a powerful dual-core microcontroller from Espressif featuring Xtensa LX7 processors, integrated WiFi 4 and Bluetooth 5 (BLE), and extensive peripheral support. Ideal for IoT devices, wireless sensor nodes, and AI/ML edge applications.',
    features: [
      'Dual Xtensa LX7 cores @ 240MHz',
      'WiFi 4 (802.11 b/g/n) + BLE 5.0',
      '8MB PSRAM, 8MB Flash (varies by module)',
      '45 programmable GPIO pins',
      'USB OTG support',
      'AI acceleration instructions',
      'Low power modes — deep sleep < 7μA',
      'Operating voltage: 3.3V'
    ],
    price: 680,
    comparePrice: 850,
    costPrice: 520,
    tags: ['ESP32', 'ESP32-S3', 'WiFi', 'BLE', 'dual-core', 'Xtensa', 'microcontroller', 'IoT', 'development board'],
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80',
    isFeatured: true,
    countInStock: 45,
    seoTitle: 'ESP32-S3 Dual Core WiFi BLE Dev Board | IoT Prototyping | Buildronics',
    seoDescription: 'Buy ESP32-S3 development board in India. Dual-core Xtensa LX7, WiFi 4, BLE 5.0, 8MB PSRAM. Fast dispatch from Bengaluru.',
    countryOfOrigin: 'China'
  },
  {
    name: 'ESP32-WROOM-32 Development Board',
    sku: 'EEKAI-MCU-ESP32W32',
    vendor: 'Espressif Systems',
    collection: 'Microcontrollers',
    description: 'The ESP32-WROOM-32 development board is the go-to choice for WiFi and Bluetooth-enabled projects. Features the popular ESP32 SoC with dual-core Xtensa LX6 processors, making it ideal for IoT gateways, smart devices, and wireless data logging.',
    features: [
      'Dual Xtensa LX6 cores @ 240MHz',
      'WiFi 802.11 b/g/n + Bluetooth 4.2 / BLE',
      '4MB Flash',
      '34 GPIO pins',
      '12-bit SAR ADC — 18 channels',
      'I2C, SPI, UART, I2S interfaces',
      'Hall sensor, capacitive touch',
      'Operating voltage: 3.3V / 5V via USB'
    ],
    price: 420,
    comparePrice: 550,
    costPrice: 310,
    tags: ['ESP32', 'WROOM', 'WiFi', 'Bluetooth', 'dual-core', 'microcontroller', 'IoT', 'development board'],
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80',
    isFeatured: true,
    countInStock: 60,
    countryOfOrigin: 'China'
  },
  {
    name: 'Arduino Uno R3 Development Board — ATmega328P',
    sku: 'EEKAI-MCU-ARDUNO',
    vendor: 'Arduino',
    collection: 'Microcontrollers',
    description: "The Arduino Uno R3 is the world's most popular microcontroller development board. Based on the ATmega328P, it offers a simple, beginner-friendly platform for learning embedded systems, building prototypes, and creating interactive projects.",
    features: [
      'ATmega328P microcontroller @ 16MHz',
      '14 digital I/O pins (6 PWM)',
      '6 analog input pins',
      '32KB Flash, 2KB SRAM, 1KB EEPROM',
      'USB-B connector for programming',
      '5V operating voltage',
      'Arduino shield compatible',
      'UART, SPI, I2C interfaces'
    ],
    price: 550,
    comparePrice: 700,
    costPrice: 400,
    tags: ['Arduino', 'Uno', 'ATmega328P', 'microcontroller', 'development board', 'beginner', 'prototyping'],
    image: 'https://images.unsplash.com/photo-1553406830-ef2513450d76?w=400&q=80',
    isFeatured: true,
    countInStock: 80,
    countryOfOrigin: 'China'
  },
  {
    name: 'Arduino Nano — ATmega328 Compact Development Board',
    sku: 'EEKAI-MCU-ARDNANO',
    vendor: 'Arduino',
    collection: 'Microcontrollers',
    description: 'The Arduino Nano is a compact, breadboard-friendly development board based on the ATmega328P. Perfect for space-constrained projects where the full Uno form factor is too large. Ideal for wearables, small robots, and embedded prototypes.',
    features: [
      'ATmega328P @ 16MHz',
      '22 digital/analog I/O pins',
      '8 analog input pins (10-bit ADC)',
      '32KB Flash, 2KB SRAM',
      'Mini-USB programming interface',
      'Breadboard compatible — 18.5mm wide',
      '5V / 3.3V power rails',
      'UART, SPI, I2C support'
    ],
    price: 380,
    comparePrice: 480,
    costPrice: 270,
    tags: ['Arduino', 'Nano', 'ATmega328', 'compact', 'microcontroller', 'breadboard', 'development board'],
    image: 'https://images.unsplash.com/photo-1553406830-ef2513450d76?w=400&q=80',
    countInStock: 70,
    countryOfOrigin: 'China'
  },
  {
    name: 'Raspberry Pi Pico W — RP2040 Wireless Microcontroller',
    sku: 'EEKAI-MCU-PICOW',
    vendor: 'Raspberry Pi',
    collection: 'Microcontrollers',
    description: 'The Raspberry Pi Pico W adds wireless connectivity to the popular RP2040 platform. With onboard WiFi and Bluetooth via the CYW43439 module, perfect for IoT projects, wireless data logging, and cloud-connected embedded systems.',
    features: [
      'RP2040 dual-core ARM Cortex-M0+ @ 133MHz',
      'CYW43439 WiFi 4 + Bluetooth 5.2 (BLE)',
      '264KB SRAM, 2MB Flash',
      '26 GPIO pins, 3 ADC channels',
      'MicroPython and C/C++ SDK support',
      'USB 1.1 host/device',
      'PIO — Programmable I/O state machines',
      'Operating voltage: 1.8–5.5V'
    ],
    price: 750,
    comparePrice: 950,
    costPrice: 580,
    tags: ['Raspberry Pi', 'Pico W', 'RP2040', 'WiFi', 'MicroPython', 'microcontroller', 'wireless'],
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80',
    isFeatured: true,
    countInStock: 35,
    countryOfOrigin: 'United Kingdom'
  },
  {
    name: 'Digilent Arty A7-35T FPGA Development Board — Xilinx Artix-7',
    sku: 'EEKAI-FPGA-A7-35',
    vendor: 'Digilent',
    collection: 'FPGA Boards',
    description: 'The Digilent Arty A7-35T is a ready-to-use FPGA development platform built around the Xilinx Artix-7 35T FPGA. Designed for engineers and students working on digital design, hardware accelerators, and FPGA-based prototyping.',
    features: [
      'Xilinx XC7A35TICSG324-1L FPGA',
      '33,280 logic cells, 90 DSP slices',
      '1,800 Kbits Block RAM',
      '256MB DDR3L memory',
      '16MB Quad-SPI Flash',
      'Gigabit Ethernet (RJ45)',
      '4x Pmod connectors, Arduino shield header',
      'Compatible with Xilinx Vivado Design Suite'
    ],
    price: 12800,
    comparePrice: 15000,
    costPrice: 10200,
    tags: ['FPGA', 'Arty', 'Artix-7', 'Xilinx', 'Digilent', 'development board', 'VLSI', 'digital design'],
    image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&q=80',
    isFeatured: true,
    countInStock: 10,
    countryOfOrigin: 'United States'
  },
  {
    name: 'Digilent Basys 3 FPGA Trainer Board — Xilinx Artix-7',
    sku: 'EEKAI-FPGA-BAS3',
    vendor: 'Digilent',
    collection: 'FPGA Boards',
    description: 'The Digilent Basys 3 is the most popular FPGA trainer board for engineering students and VLSI coursework. Built around the Xilinx Artix-7 35T, it includes onboard I/O (switches, LEDs, 7-segment displays) making it ideal for labs without additional hardware.',
    features: [
      'Xilinx XC7A35T-1CPG236C FPGA',
      '33,280 logic cells, 90 DSP slices',
      '16 switches, 16 LEDs',
      '4-digit 7-segment display',
      '5 pushbuttons',
      '12-bit VGA connector',
      'USB HID host for keyboard/mouse',
      '4x Pmod connectors'
    ],
    price: 13500,
    comparePrice: 16000,
    costPrice: 10800,
    tags: ['FPGA', 'Basys 3', 'Artix-7', 'Xilinx', 'Digilent', 'trainer', 'VLSI', 'student', 'development board'],
    image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&q=80',
    countInStock: 8,
    countryOfOrigin: 'United States'
  },
  {
    name: 'MPU-6050 6-Axis IMU Accelerometer Gyroscope Module',
    sku: 'EEKAI-SEN-MPU6050',
    vendor: 'InvenSense / TDK',
    collection: 'Sensors',
    description: 'The MPU-6050 is a 6-axis IMU combining a 3-axis accelerometer and 3-axis gyroscope on a single chip. With onboard Digital Motion Processor (DMP) and I2C interface, the standard choice for motion sensing in robotics, drones, wearables, and gesture recognition systems.',
    features: [
      '3-axis accelerometer + 3-axis gyroscope',
      'Digital Motion Processor (DMP) onboard',
      'I2C interface (up to 400kHz)',
      '16-bit ADC resolution',
      'Accelerometer range: ±2g, ±4g, ±8g, ±16g',
      'Gyroscope range: ±250, ±500, ±1000, ±2000 °/s',
      'Operating voltage: 3.3V / 5V compatible',
      'Interrupt output pin'
    ],
    price: 180,
    comparePrice: 240,
    costPrice: 120,
    tags: ['MPU-6050', 'IMU', 'accelerometer', 'gyroscope', '6-axis', 'I2C', 'motion sensing', 'wearable'],
    image: 'https://images.unsplash.com/photo-1574928329096-d9ffe00d9ea3?w=400&q=80',
    isFeatured: true,
    countInStock: 100,
    countryOfOrigin: 'China'
  },
  {
    name: 'ADS1115 16-bit 4-Channel ADC Module — I2C',
    sku: 'EEKAI-SEN-ADS1115',
    vendor: 'Texas Instruments',
    collection: 'Sensors',
    description: 'The ADS1115 is a precision 16-bit analog-to-digital converter with I2C interface from Texas Instruments. With 4 single-ended or 2 differential input channels and a programmable gain amplifier (PGA), ideal for precision measurements and biosignal acquisition.',
    features: [
      '16-bit delta-sigma ADC',
      '4 single-ended / 2 differential inputs',
      'Programmable Gain Amplifier (PGA): ±6.144V to ±0.256V',
      'Data rate: 8 to 860 SPS',
      'I2C interface — 4 selectable addresses',
      'Comparator with alert/ready pin',
      'Operating voltage: 2.0V to 5.5V',
      'Low current: 150μA continuous'
    ],
    price: 320,
    comparePrice: 420,
    costPrice: 240,
    tags: ['ADS1115', 'ADC', '16-bit', 'I2C', 'analog-to-digital', 'precision', 'data acquisition'],
    image: 'https://images.unsplash.com/photo-1574928329096-d9ffe00d9ea3?w=400&q=80',
    countInStock: 60,
    countryOfOrigin: 'China'
  },
  {
    name: 'MAX30100 Pulse Oximeter Heart Rate Sensor Module',
    sku: 'EEKAI-SEN-MAX30100',
    vendor: 'Maxim Integrated',
    collection: 'Sensors',
    description: 'The MAX30100 is an integrated pulse oximetry and heart rate monitor sensor from Maxim Integrated. Combines two LEDs, a photodetector, and signal processing electronics to detect SpO2 and heart rate via photoplethysmography (PPG).',
    features: [
      'SpO2 and heart rate measurement',
      'Red (660nm) and IR (880nm) LEDs',
      '18-bit sigma-delta ADC',
      'I2C interface',
      'Programmable LED current: 0 to 50mA',
      'Ultra-low power — 0.7mA active, 0.7μA standby',
      'Operating voltage: 1.8V (core), 3.3V (LEDs)',
      'FIFO data buffer — 16 samples'
    ],
    price: 420,
    comparePrice: 550,
    costPrice: 310,
    tags: ['MAX30100', 'pulse oximeter', 'SpO2', 'heart rate', 'biosignal', 'biomedical', 'PPG', 'I2C'],
    image: 'https://images.unsplash.com/photo-1574928329096-d9ffe00d9ea3?w=400&q=80',
    countInStock: 40,
    countryOfOrigin: 'China'
  },
  {
    name: 'AD8232 ECG Heart Rate Monitor Module',
    sku: 'EEKAI-SEN-AD8232',
    vendor: 'Analog Devices',
    collection: 'Sensors',
    description: 'The AD8232 ECG module from Analog Devices is a single-lead heart rate monitor front-end IC for biosignal acquisition. Provides instrumentation amplifier, right leg drive, lead-off detection, and output filtering for a complete ECG measurement system.',
    features: [
      'Single-supply operation: 2.0V to 3.5V',
      'Integrated instrumentation amplifier',
      'Right leg drive (RLD) output',
      'Lead-off detection (AC and DC)',
      'Two-pole high-pass filter — 0.5Hz corner',
      'Shutdown mode: 170nA current',
      'Output: analog ECG waveform',
      '3-lead electrode connection (RA, LA, RL)'
    ],
    price: 380,
    comparePrice: 500,
    costPrice: 280,
    tags: ['AD8232', 'ECG', 'heart rate', 'biosignal', 'biomedical', 'analog', 'electrocardiogram'],
    image: 'https://images.unsplash.com/photo-1574928329096-d9ffe00d9ea3?w=400&q=80',
    countInStock: 35,
    countryOfOrigin: 'China'
  },
  {
    name: 'NEO-6M GPS Module with Antenna',
    sku: 'EEKAI-COM-NEO6M',
    vendor: 'u-blox',
    collection: 'Communication',
    description: 'The NEO-6M GPS module from u-blox offers high-sensitivity GPS reception with a ceramic patch antenna. Outputs standard NMEA sentences via UART, compatible with Arduino, STM32, Raspberry Pi, and any UART-capable microcontroller.',
    features: [
      'u-blox NEO-6M GPS chip',
      'Position accuracy: ±2.5m CEP',
      'Acquisition: Cold start 27s, Hot start 1s',
      'Sensitivity: -161dBm tracking',
      'UART interface — 9600 baud default',
      '3.3V / 5V compatible',
      'Onboard LNA and ceramic patch antenna',
      'NMEA 0183 output protocol'
    ],
    price: 520,
    comparePrice: 680,
    costPrice: 390,
    tags: ['GPS', 'NEO-6M', 'u-blox', 'UART', 'navigation', 'location', 'tracking', 'NMEA'],
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
    isFeatured: true,
    countInStock: 30,
    countryOfOrigin: 'China'
  },
  {
    name: 'SIM800L GSM GPRS Module — Quad Band',
    sku: 'EEKAI-COM-SIM800L',
    vendor: 'SIMCom',
    collection: 'Communication',
    description: 'The SIM800L is a compact quad-band GSM/GPRS module supporting 850/900/1800/1900MHz frequencies. Send SMS, make calls, and transmit GPRS data using standard AT commands via UART. Widely used in IoT devices and remote monitoring.',
    features: [
      'Quad-band GSM/GPRS 850/900/1800/1900MHz',
      'GPRS Class 10: 85.6kbps download',
      'SMS send and receive',
      'Voice call support',
      'AT command interface via UART',
      'Supply voltage: 3.4V to 4.4V',
      'TCP/IP stack built-in',
      'Dimensions: 24mm × 24mm'
    ],
    price: 480,
    comparePrice: 620,
    costPrice: 350,
    tags: ['SIM800L', 'GSM', 'GPRS', 'SIM', 'cellular', 'SMS', 'AT commands', 'UART', 'IoT'],
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
    countInStock: 25,
    countryOfOrigin: 'China'
  },
  {
    name: 'HC-05 Bluetooth Serial Module — Master/Slave',
    sku: 'EEKAI-COM-HC05',
    vendor: 'HC',
    collection: 'Communication',
    description: 'The HC-05 is a classic Bluetooth 2.0 SPP (Serial Port Profile) module that provides wireless serial communication between microcontrollers and Bluetooth-enabled devices. Configurable as master or slave via AT commands.',
    features: [
      'Bluetooth 2.0 + EDR',
      'Serial Port Profile (SPP)',
      'Master or Slave mode — AT configurable',
      'UART interface: 1200 to 1382400 baud',
      'Range: up to 10m',
      'Operating voltage: 3.3V (5V tolerant via module)',
      'Pairing PIN configurable',
      'Dimensions: 27mm × 13mm'
    ],
    price: 320,
    comparePrice: 420,
    costPrice: 230,
    tags: ['HC-05', 'Bluetooth', 'serial', 'UART', 'wireless', 'master', 'slave', 'SPP'],
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
    countInStock: 55,
    countryOfOrigin: 'China'
  },
  {
    name: 'CP2102 USB to UART Bridge Module',
    sku: 'EEKAI-COM-CP2102',
    vendor: 'Silicon Labs',
    collection: 'Communication',
    description: 'The CP2102 USB to UART bridge module from Silicon Labs provides reliable USB to serial conversion for programming and debugging microcontrollers. Supports Windows, Linux, and macOS with standard USB CDC drivers.',
    features: [
      'CP2102 single-chip USB-UART bridge',
      'USB 2.0 Full Speed (12Mbps)',
      'Baud rate: 300 to 921600bps',
      'Micro-USB connector',
      '3.3V and 5V power output pins',
      'TX/RX/RTS/CTS/DTR/DSR signals',
      'Windows / Linux / macOS driver support',
      'Dimensions: 36mm × 13mm'
    ],
    price: 180,
    comparePrice: 240,
    costPrice: 120,
    tags: ['CP2102', 'USB', 'UART', 'serial', 'bridge', 'programming', 'Silicon Labs', 'USB-TTL'],
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
    countInStock: 75,
    countryOfOrigin: 'China'
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/buildronics');
    console.log('Connected to MongoDB');

    await Product.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared existing data');

    const insertedProducts = await Product.insertMany(products);
    console.log(`✅ Inserted ${insertedProducts.length} products`);

    // Create admin user
    const admin = await User.create({
      name: 'Admin EEKAI',
      email: 'admin@buildronics.com',
      password: 'Admin@123',
      phone: '9876543210',
      isAdmin: true
    });
    console.log('✅ Admin user created: admin@buildronics.com / Admin@123');

    // Create test user
    const testUser = await User.create({
      name: 'Test User',
      email: 'test@buildronics.com',
      password: 'Test@123',
      phone: '9876543211'
    });
    console.log('✅ Test user created: test@buildronics.com / Test@123');

    console.log('\n🚀 Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exit(1);
  }
}

seed();
