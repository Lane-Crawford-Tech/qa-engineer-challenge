import axios from 'axios'
import { DataGrid } from '@mui/x-data-grid'
import { useCallback, useEffect, useState } from "react"
import { CircularProgress, Backdrop } from '@mui/material'

// Logger configuration
const logger = {
  error: (message, error) => {
    console.error(`[${new Date().toISOString()}] Error: ${message}`, error);
    // Log to file system or external service
    logToFile(`[ERROR] ${message}`, error);
  },
  warn: (message) => {
    console.warn(`[${new Date().toISOString()}] Warning: ${message}`);
    logToFile(`[WARN] ${message}`);
  },
  info: (message) => {
    console.info(`[${new Date().toISOString()}] Info: ${message}`);
    logToFile(`[INFO] ${message}`);
  }
};

// Helper function to write logs to file
const logToFile = (message, error = null) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    message,
    error: error ? {
      name: error.name,
      message: error.message,
      stack: error.stack
    } : null
  };

  // You can implement your file writing logic here
  // For example, using a backend API endpoint:
  try {
    fetch('/api/logs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(logEntry)
    });
  } catch (e) {
    console.error('Failed to write to log file:', e);
  }
};

const columns = [
  {
    field: 'id',
    headerName: 'ID',
    width: 150,
    resizable: false
  },
  {
    field: 'categories',
    headerName: 'Categories',
    width: 250,
    editable: false,
    resizable: false,
  },
  {
    field: 'name',
    headerName: 'Name',
    width: 150,
    editable: false,
    resizable: false,
  },
  {
    field: 'inStock',
    headerName: 'In Stock',
    type: 'boolean',
    width: 150,
    editable: false,
    resizable: false,
  },
  {
    field: 'price',
    headerName: 'Price',
    type: 'number',
    width: 150,
    editable: false,
    resizable: false,
    valueFormatter: (params) => {
      try {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'HKD',
          minimumFractionDigits: 2,
        }).format(params);
      } catch (error) {
        logger.error('Failed to format price', error);
        return 'N/A';
      }
    }
  },
];

const ProductPage = () => {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [filterValue, setFilterValue] = useState('')
  const [error, setError] = useState(null)

  const getRandomDelay = () => {
    try {
      return Math.floor(Math.random() * (60000 - 2000 + 1) + 2000)
      //return Math.floor(Math.random() * (6000 - 2000 + 1) + 2000)
    } catch (error) {
      logger.error('Failed to generate random delay', error);
      return 2000; // fallback delay
    }
  }

  const handleFilterModelChange = async (filterState) => {
    try {
      logger.info(`Applying filter: ${JSON.stringify(filterState)}`);

      if (filterState.items[0]?.value || filterValue !== '') {
        setFilterValue(filterState.items[0]?.value || '')
        setIsLoading(true)
        await new Promise(resolve => setTimeout(resolve, getRandomDelay()))
      }
    } catch (error) {
      logger.error('Filter operation failed', error)
      setError('Failed to filter products')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSortModelChange = async (sortState) => {
    try {
      logger.info(`Applying sort: ${JSON.stringify(sortState)}`);

      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, getRandomDelay()))
    } catch (error) {
      logger.error('Sort operation failed', error)
      setError('Failed to sort products')
    } finally {
      setIsLoading(false)
    }
  }

  const loadProducts = useCallback(async () => {
    try {
      logger.info('Loading products...');

      const response = await axios.get(`${window.location.origin}/products.json`)

      if (!Array.isArray(response.data)) {
        throw new Error('Invalid data format received');
      }

      // Validate product data
      response.data.forEach((product, index) => {
        if (!product.id || !product.name || !product.categories) {
          logger.warn(`Invalid product data at index ${index}`);
        }
      });

      setProducts(response.data)
      logger.info(`Successfully loaded ${response.data.length} products`);
    } catch (error) {
      logger.error('Failed to load products', error)
      setError('Failed to load products')
    }
  }, [])

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  const handleError = (error) => {
    logger.error('DataGrid error occurred', error);
    setError('An error occurred while displaying products');
  };

  return (
    <div>
      <title>Products</title>
      {error && (
        <div style={{
          color: 'red',
          marginBottom: '1rem',
          padding: '1rem',
          backgroundColor: '#fee'
        }}>
          {error}
        </div>
      )}

      <div>
        <div>
          <p>In this page, you should be able to view a list of products</p>
          <p>There are exactly 100 items, you can filter/sort the data via the table head below
            (the menu will show up when you hover the mouse over the table head)</p>
          <div style={{ marginLeft: '30px', border: '1px solid #bbb', display: 'inline-block' }}>
            <img
              width='120px'
              src={'/filter-instruction.png'}
              alt='table header menu' />
          </div>
        </div>
        <p>
          Each of them should belong to at least 1 of 4 categories
          here is a sample of a valid product:
        </p>
        <table style={{ marginLeft: 30 }}>
          <tbody>
          {Object.entries({
            "id": 1100,
            "categories": ["Category 1", "Category 2"],
            "name": "Product 100",
            "image": "https://picsum.photos/400?image=530",
            "inStock": true,
            "price": 381
          }).map(([k, v]) => (
            <tr key={k}>
              <td style={{ paddingRight: 15 }}>{k}</td>
              <td>{Array.isArray(v) ? v.join(', ') : String(v)}</td>
            </tr>
          ))}
          </tbody>
        </table>

        <div style={{ marginTop: 20 }}>
          Please help to test:
          <ol>
            <li>filter results should match selected criteria, e.g. if we selected Category 4, all products listed in the result should have "Category 4" in the categories field</li>
            <li>check if any data are strange/unexpected</li>
            <li>you are encouraged to test <a href='/products.json'>the API response</a> too</li>
          </ol>
        </div>
      </div>

      <Backdrop
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1
        }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <div>
        <DataGrid
          autoHeight
          style={{ marginTop: 20 }}
          rows={products}
          columns={columns}
          pageSizeOptions={[10, 25]}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10 }
            },
          }}
          disableSelectionOnClick={true}
          disableColumnSelector={true}
          onFilterModelChange={handleFilterModelChange}
          onSortModelChange={handleSortModelChange}
          loading={isLoading}
          error={error}
          onError={handleError}
        />
      </div>
    </div>
  )
}

export default ProductPage
