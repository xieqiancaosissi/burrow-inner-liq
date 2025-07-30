export const getTokenHolders = async (
  dimension: "d" | "w" | "m" = "d",
  pageNumber: number = 1,
  pageSize: number = 100
) => {
  // Calculate number based on dimension
  let number = 1;
  switch (dimension) {
    case "d":
      number = 1; // 1 day
      break;
    case "w":
      number = 7; // 7 days
      break;
    case "m":
      number = 30; // 30 days
      break;
  }

  return await fetch(
    `https://mainnet-indexer.ref-finance.com/token_holders?number=${number}&page_number=${pageNumber}&page_size=${pageSize}`,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  )
    .then(async (res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      return data;
    })
    .catch((error) => {
      console.error("API Error:", error);
      return {
        record_list: [],
        page_number: 1,
        page_size: 100,
        total_page: 1,
        total_size: 0,
      };
    });
};

// Get all pages data
export const getAllPagesData = async (dimension: "d" | "w" | "m" = "d") => {
  try {
    // 1. First get the first page to determine total pages
    const firstPage = await getTokenHolders(dimension, 1, 100);
    const totalPages = firstPage.total_page || 1;

    console.log(
      `Total pages: ${totalPages}, fetching all pages in parallel...`
    );

    // 2. Parallel requests for all pages
    const pagePromises = [];
    for (let page = 1; page <= totalPages; page++) {
      pagePromises.push(getTokenHolders(dimension, page, 100));
    }

    // 3. Wait for all page data
    const allPages = await Promise.all(pagePromises);

    // 4. Combine all data
    const allRecords = allPages.reduce((acc, pageData) => {
      return acc.concat(pageData.record_list || []);
    }, []);

    console.log(`Total records collected: ${allRecords.length}`);

    return {
      record_list: allRecords,
      total_size: allRecords.length,
      dimension,
    };
  } catch (error) {
    console.error("Error fetching all pages:", error);
    return { record_list: [], total_size: 0, dimension };
  }
};

// New: fetch multi-day historical data for ranking change chart
// Fetch data for the most recent days
// Add date marker for each day's data
// Add delay to avoid API rate limit
export const getMultiDayData = async (
  dimension: "d" | "w" | "m" = "d",
  days: number = 7
) => {
  try {
    console.log(`Fetching ${days} days of data for dimension: ${dimension}`);

    const allData: any[] = [];

    for (let day = 0; day < days; day++) {
      const response = await getAllPagesData(dimension);
      if (response.record_list && response.record_list.length > 0) {
        const dayData = response.record_list.map((record: any) => ({
          ...record,
          day: day,
        }));
        allData.push(...dayData);
      }

      if (day < days - 1) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    console.log(`Total multi-day records collected: ${allData.length}`);

    return {
      record_list: allData,
      total_size: allData.length,
      dimension,
      days,
    };
  } catch (error) {
    console.error("Error fetching multi-day data:", error);
    return { record_list: [], total_size: 0, dimension, days };
  }
};

// Get conversion token data
export const getConversionTokenData = async (
  dimension: "d" | "w" | "m" = "d",
  pageNumber: number = 1,
  pageSize: number = 100
) => {
  // Calculate number based on dimension
  let number = 1;
  switch (dimension) {
    case "d":
      number = 1; // 1 day
      break;
    case "w":
      number = 7; // 7 days
      break;
    case "m":
      number = 30; // 30 days
      break;
  }

  return await fetch(
    `https://mainnet-indexer.ref-finance.com/conversion_token_data?number=${number}&page_number=${pageNumber}&page_size=${pageSize}`,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  )
    .then(async (res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      return data;
    })
    .catch((error) => {
      console.error("Conversion API Error:", error);
      return {
        record_list: [],
        page_number: 1,
        page_size: 100,
        total_page: 1,
        total_size: 0,
      };
    });
};

// Get all pages conversion data
export const getAllPagesConversionData = async (
  dimension: "d" | "w" | "m" = "d"
) => {
  try {
    // 1. First get the first page to determine total pages
    const firstPage = await getConversionTokenData(dimension, 1, 100);
    const totalPages = firstPage.total_page || 1;

    console.log(
      `Total conversion pages: ${totalPages}, fetching all pages in parallel...`
    );

    // 2. Parallel requests for all pages
    const pagePromises = [];
    for (let page = 1; page <= totalPages; page++) {
      pagePromises.push(getConversionTokenData(dimension, page, 100));
    }

    // 3. Wait for all page data
    const allPages = await Promise.all(pagePromises);

    // 4. Combine all data
    const allRecords = allPages.reduce((acc, pageData) => {
      return acc.concat(pageData.record_list || []);
    }, []);

    console.log(`Total conversion records collected: ${allRecords.length}`);

    return {
      record_list: allRecords,
      total_size: allRecords.length,
      dimension,
    };
  } catch (error) {
    console.error("Error fetching all conversion pages:", error);
    return { record_list: [], total_size: 0, dimension };
  }
};
