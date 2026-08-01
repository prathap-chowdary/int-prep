const cats = ["DataFrame Basics", "basics", "core", "intermediate", "Advanced"];
const qs = [
  {
    cat: `DataFrame Basics`,
    q: `DataFrame Basics for awareness`,
    answer: ``,
    children: [
      {
        q: `
 Select all columns except age.
<br>
Select distinct departments.
<br>
Select only numeric columns.
<br>
Rename all columns to lowercase.
<br>
Rename all columns to uppercase.
<br>
Add a prefix (emp_) to every column.
<br>
Add a suffix (_new) to every column.

 `,
        a: `

<pre><code class="language-python">
#1)  Select all columns except age. 
df.select([c for c in df.columns if c != "age"]) # df.drop("age")

#2) Select distinct departments.
df.select("dept").distinct()

#3) Select only numeric columns.
from pyspark.sql.types import NumericType
for f in df.schema.fields:
    print(f.dataType,f.name)
df.select(*[c.name  for c in df.schema.fields if isinstance(c.dataType,NumericType) ])

#4-7) rename , adding suffix/prefix using toDF
df.toDF(*[ "emp_"+c+"_new" for c in df.columns ])
df.toDF(*[ c.upper() for c in df.columns ])


</code></pre>

        `,
        children: [],
      },
      {
        q: `  
 <p style="color:violet">
 Sort department ascending and salary descending.<br>
 display the first 10 rows.<br>
 Get first 10 rows as a list<br>
 Randomly sample 20% of the data.<br>
 Keep only unique departments.<br>
 Keep unique combinations of multiple columns <br>
 Remove duplicate rows (all columns) <br>
Remove duplicates based on specific columns
 </p>
 `,
        a: `
        
        <pre><code class="language-python">
# 1) Sort department ascending and salary descending.
df.orderBy(col("dept").asc(), col("salary").desc())

# 2) FIrst 10 rows
df.show(10)

# 3) Get first 10 rows as a list
df.take(10) or df.head(5)

# 4) Randomly sample 20% of the data.
df.sample(0.2) #non reproducable. If reproducable req then 
df.sample(0.2,seed=42)

# 5) Keep only unique departments
df.select("dept").distinct()

# 6) Keep unique combinations of multiple columns
df.select("dept", "gender").distinct()

# 7) Remove duplicate rows (all columns)
df.dropDuplicates()

# 8) Remove duplicates based on specific columns
# (Keeps one row for each unique dept-gender combination)
df.dropDuplicates(["dept", "gender"])

</code> </pre>`,
        tip: `show(n) → Displays rows in the console (used for debugging).<br>
take(n) / head(n) → Returns rows to the driver as a Python list.<br>
first() → Returns only the first row. There is no first(n) method.

<table>
  <thead>
    <tr>
      <th>Method</th>
      <th>Returns</th>
      <th>Ordered?</th>
      <th>Return Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>first()</code></td>
      <td>First row</td>
      <td>❌ No</td>
      <td><code>Row</code></td>
    </tr>
    <tr>
      <td><code>head()</code></td>
      <td>First row</td>
      <td>❌ No</td>
      <td><code>Row</code></td>
    </tr>
    <tr>
      <td><code>head(n)</code></td>
      <td>First n rows</td>
      <td>❌ No</td>
      <td><code>List[Row]</code></td>
    </tr>
    <tr>
      <td><code>take(n)</code></td>
      <td>First n rows</td>
      <td>❌ No</td>
      <td><code>List[Row]</code></td>
    </tr>
    <tr>
      <td><code>show(n)</code></td>
      <td>Displays first n rows</td>
      <td>❌ No</td>
      <td><code>None</code></td>
    </tr>
    <tr>
      <td><code>tail(n)</code></td>
      <td>Last n rows</td>
      <td>❌ No</td>
      <td><code>List[Row]</code></td>
    </tr>
  </tbody>
</table>
<br>
distinct() → Returns only the selected columns with duplicate rows removed.<br>
dropDuplicates() → Returns all columns, removing duplicates based on all columns or specified subset.
`,
        children: [
          {
            q: `Do first(), head(), and take() always return the same first record?`,
            a: `
       NO.  A Spark DataFrame is distributed across multiple partitions, and Spark does not maintain a global row order unless you explicitly specify one. <br>This returns some row that Spark encounters first during execution, not necessarily the first row from the original source file or the same row every time.
        `,
            children: [],
          },

        ],
      },
      {
        q: `
 <p style= "color:orange">
 drop cols <br>
 drop multiple cols <br>
 Remove duplicates based on dept and salary.<br>
 Remove duplicate rows<br>
 Drop rows containing null values (default: any column is null)<br>
 Remove rows only if all columns are null<br>
Remove rows if any of the specified columns are null<br>
 fill nulls with 0 or unknown<br>
 fill nulls if age=0; gender=NA
 </p>
 `,
        a: `

<pre><code class="language-python">
# 1) drop cols
df.drop("age")

# 2) Drop multiple cols
df.drop("salary", "dept", "age")

# 3) remove duplicate rows
df.dropDuplicates() # Removes rows that are identical across all columns.

# 4)   Remove duplicates based on dept and salary.<br>
df.dropduplicates(["dept","age"]) # Keeps one row for each unique (dept, age) combination.

# 5) Drop rows containing null values (default: any column is null)
df.dropna()

# Remove rows only if all columns are null
df.dropna(how="all")

# Remove rows if any of the specified columns are null
df.dropna(subset=["age", "gender"])

# 6) Fill all numeric nulls with 0
df.fillna(0)

# Fill all string nulls with "Unknown"
df.fillna("Unknown")

# 7) Fill specific columns with different values
df.fillna({
    "age": 0,
    "gender": "NA"
})

</code></pre>        
        `,
        children: [],
      },
    ],

  },////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// new 
  {
    cat: `basics`,
    q: `Basic coding questions/ 1 liners`,
    answer: ``,
    children: [

      {
        q: `
<p style="color:violet">Find the total number of employees.<br>
Find the highest/lowest/avg salary.<br>
"How many duplicate name occurrences are there?"<br>
duplicate employee names.

`,
        a: `
        
<pre><code class="language-python">
# 1) no.of employees
df.count() 

# 2) highest/lowest sal
df.select(expr("max(salary) as max_salary "),expr("min(salary) as min_salary "))
df.selectExpr("max(salary) as max_salary , min(salary) as min_salary")) #using sql syntax
df.select(max("salary").alias("max_salary"),min("salary").alias("min_alias")) # using dataframe API
df.agg(max("salary").alias("max_salary"),min("salary").alias("min_salary"))

# 3) "How many duplicate name occurrences are there?"
df.select("name").count()-df.select("name").distinct().count()

# 4) <b>Duplicate Names</b> Below name, name_count will display
df.groupBy("name").agg(count("name").alias("name_count")).filter(col("name_count")>1).display() 


</code></pre>



        `,
tip:`df.count() does not accept any arguments. <br>
expr accepts only 1 statement , if multiple req use <b>selectExpr<b>
`,
        children: [],
      },
      {
        q: `
        <p style="color:"></p>
        `,
        a: ``,
        children: [],
      }, {
        q: ``,
        a: ``,
        children: [],
      }, {
        q: ``,
        a: ``,
        children: [],
      },
    ],
  },
  {
    cat: `core`,
    q: `Core-1`,
    answer: ``,

    children: [
      {
        q: `	Top N / Highest / Lowest per dept`,
        tip: `For Top N problems — always clarify with interviewer whether ties should be included. Default safe choice: DENSE_RANK.`,

        a: `
        
<pre><code class="language-python">
window= Window.partitionBy("dept").orderBy(col("salary").desc())
df.withColumn("rank",dense_rank().over(window))
        .filter(col("rank") <= N)
            .select("emp_id", "name", "department", "salary", "rank")
                .orderBy("department", "rank")
                  .show()
                
</code></pre>


<pre><code class="language-sql">
-- Using DENSE_RANK to handle ties
WITH ranked AS (
    SELECT
        emp_id,
        name,
        department,
        salary,
        DENSE_RANK() OVER (
            PARTITION BY department
            ORDER BY salary DESC
        ) AS rank
    FROM employees
)
SELECT *
FROM ranked
WHERE rank <= 3
ORDER BY department, rank;
</code></pre>
        `,
        tip: `For Top N problems — always clarify with interviewer whether ties should be included. Default safe choice: DENSE_RANK.
        <br> Top N with percentage → e.g. top 10% instead of top 3 → use PERCENT_RANK <br>
Top N excluding nulls → add WHERE salary IS NOT NULL before ranking<br>
 <span style="color:Violet;"><b>  ROW_NUMBER </b></span> 	No ties — assigns unique rank, arbitrary tiebreak<br>
 <span style="color:Violet;"><b>  Rank </b></span> 	Ties get same rank, next rank skips (1,2,2,4)<br>
 <span style="color:Violet;"><b>  DENSE_RANK </b></span> 	Ties get same rank, next rank does not skip (1,2,2,3)
        `,
        children: [
          {
            q: `Top N percentage`,
            a: `
            Same but only diff is instead of Dense_rank()use PERCENT_RANK()
            
<pre><code class="language-python"> 
df.withColumn("rak",percent_rank().over(window))
                .filter(col("rak)<=0.10)
</code></pre>
            `,
            tip: `top 10% => rnk <=0.10 <br>
            top 25% => rnk <=0.25`,
            children: [],
          },
        ],
      },

    ],

  },////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// new 
  {
    cat: `core`,
    q: `Core-2`,
    answer: ``,
    children: [],

  },////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// new 
  {
    cat: `intermediate`,
    q: `intermediate-1`,
    answer: ``,
    children: [],

  },////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// new 
  {
    cat: `intermediate`,
    q: `intermediate-2`,
    answer: ``,
    children: [],

  },////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// new 
  {
    cat: `Advanced`,
    q: `Advanced-1`,
    answer: ``,
    children: [],

  },////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// new 
  {
    cat: `Advanced`,
    q: `Advanced-2`,
    answer: ``,
    children: [],

  },////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// new 
  {
    cat: ``,
    q: ``,
    answer: ``,
    children: [],

  },////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// new 
  {
    cat: ``,
    q: ``,
    answer: ``,
    children: [],

  },
]