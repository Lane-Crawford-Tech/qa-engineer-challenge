import axios from 'axios'
import { DataGrid } from '@mui/x-data-grid'
import { useCallback, useEffect, useState } from "react"
import { CircularProgress, Backdrop } from '@mui/material'

const columns = [
  { field: 'id',
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
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'HKD',
                minimumFractionDigits: 2,
            }).format(params);
        }
  },
]

const ProductPage = () => {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [filterValue, setFilterValue] = useState('')

  const getRandomDelay = () => {
    // return Math.floor(Math.random() * (60000 - 2000 + 1) + 2000)
    return Math.floor(Math.random() * (6000 - 2000 + 1) + 2000)
  }

  const handleFilterModelChange = async (filterState) => {
    if (filterState.items[0]?.value || filterValue !== '') {  // Check current or previous filter
      setFilterValue(filterState.items[0]?.value || '')
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, getRandomDelay()))
      setIsLoading(false)
    }
  }

  const handleSortModelChange = async (sortState) => {
    // Trigger for both sort and unsort actions
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, getRandomDelay()))
    setIsLoading(false)
  }

  const loadProducts = useCallback(async () => {
    const response = await axios.get(`${window.location.origin}/products.json`)
    setProducts(response.data)
  })

  useEffect(() => {
    loadProducts()
  }, [])

  return (
    <div>
      <title>Products</title>
      {/* <h1>Let's Search Something</h1> */}
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
        {/*
        <form
          data-testid='search-form'
          onSubmit={handleSubmit(loadProducts)}>
          <div><TextField type='number' placeholder='product ID' /></div>
          <div>
            <TextField type='number' placeholder='min price' />
            <TextField type='number' placeholder='max price' />
          </div>
          <div>
            <TextField
              value='Category 1'
              label="Category"
              select style={{ width: 200 }}>
              {Array(4).fill(0).map((_, i) => {
                const categoryVal = `Category ${i + 1}`
                return <MenuItem
                  key={categoryVal}
                  value={categoryVal}>{categoryVal}</MenuItem>
              })}
            </TextField>
          </div>
          <Button
            style={{ margin: 20 }}
            variant="contained"
            type="submit"
            color="primary">Search</Button>
        </form>
        */}
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
          loading={false}
        />
      </div>
    </div >
  )
}

export default ProductPage
