const cats = ["DataFrame Basics", "basics", "core", "intermediate", "Advanced"];
const qs = [
  {
    cat: `DataFrame Basics`,
    q: `DataFrame Basics for awareness`,
    answer: ``,
    children: [
      {
        q: `
Show 5 rows without truncating
<br>
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

df.show(5,truncate=False)

print(len(df.columns))

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
      <th>Ex</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>first()</code></td>
      <td>First row</td>
      <td>❌ No</td>
      <td><code>Row</code></td>
      <td>
<pre><code class="language-python">  Row(emp_id=1, name='Alice', dept_id=101, salary=70000) </code></pre> </td>
    </tr>
    <tr>
      <td><code>head()/head(1)</code></td>
      <td>First row</td>
      <td>❌ No</td>
      <td><code>Row</code></td>
        <td><pre><code class="language-python">  Row(emp_id=1, name='Alice', dept_id=101, salary=70000) </code></pre> </td>
    </tr>
    <tr>
      <td><code>head(n)</code></td>
      <td>First n rows</td>
      <td>❌ No</td>
      <td><code>List[Row]</code></td>
        <td><pre><code class="language-python">  [Row(emp_id=1, name='Alice', dept_id=101, salary=70000),
         Row(emp_id=2, name='Bob', dept_id=102, salary=50000)] </code></pre> </td>
    </tr>
    <tr>
      <td><code>take(n)</code></td>
      <td>First n rows</td>
      <td>❌ No</td>
      <td><code>List[Row]</code></td>
        <td>👆</td>
    </tr>
    <tr>
      <td><code>show(n)</code></td>
      <td>Displays first n rows</td>
      <td>❌ No</td>
      <td><code>None</code></td>
        <td>👆</td>
    </tr>
    <tr>
      <td><code>tail(n)</code></td>
      <td>Last n rows</td>
      <td>❌ No</td>
      <td><code>List[Row]</code></td>
        <td>👆</td>
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
          {
            q: ` how it works`,
            a: `
            take(n) / first() / head(n) — ✅ Most Efficient => Processes only what's needed (can stop early) => Returns n rows to driver
<br>
tail(n) — ⚠️ Expensive (processes all, returns few) => Must process the ENTIRE dataset to find the last rows => Only returns n rows to driver <br>
collect() — ⚠️ Dangerous (processes all, returns all) => Must process the ENTIRE dataset  =>Brings ALL rows to driver memory => can crash with OutOfMemoryError on large data
            `,
            children: [],
          },
          {
            q: `how to access single , list of rows`,
            a: `
            
<pre><code class="language-python"> 
row = emp.first()
# Three ways to access:
row.SALARY        # Attribute access
row['SALARY']     # Dictionary-style
row[0]                 # Index position

#########################################################333
rows = emp.take(3)

# Loop
for row in rows:
    print(f"{row.name}: {row.salary}")
# Extract column values
all_names = [row.name for row in rows]
# Output: ['Alice', 'Bob', 'Charlie']

</code></pre>
            `,
            children: [],
          },
          {
            q: `display vs show`,
            a: `
            show() — PySpark method that prints plain text table to console (default 20 rows), works anywhere.
<br>
display() — Databricks utility that renders interactive HTML table with sorting/filtering/charts (default 1000 rows), only in Databricks notebooks.
            `,
            children: [],
          }

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
#Dynamic list of columns: df.drop(*cols) ✅ (preferred in ETL pipelines)
cols = ["age", "salary", "dept"]
df.drop(*cols)

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
      {
        q: `
        <p style= "color:#569746">
Add a constant column country='India'.<br>
Add today's date,current timestamp.<br>
round off to nearest 1000<br>
Create a column showing salary in lakhs.
 </p>
        `,
        a: `
        
<pre><code class="language-python">
# Add a constant col , add date , ts cols
emp.withColumn("country",lit("india")).withColumn("date",current_date()).withColumn("ts",current_timestamp()).show()

# nearest 1000
emp.withColumn("salaryed", expr("round(salary, -3)")).show()

# Create a column showing salary in lakhs.
emp.withColumn("y_sal_in_lakhs", round(col("sal") / 100000, 2)) \



</code></pre>
        `,
        tip: `
<ul>
<li> for getting date and ts , use  current_timestamp() , current_date() not date()/timestamp()</li>
<li> //(quotient) is available in python only not applicable in spark sql/ PySpark. So use division and then extract floor</li>
<li>round(salary, -3) — the second argument is the scale. <br>
Positive scale → rounds to decimal places → round(3.14159, 2) = 3.14<br>
Zero → rounds to whole number<br>
Negative scale → rounds to left of decimal point</li>
</ul>

        `,
        children: [],
      },
      {
        q: `<p style="color:violet">
        <ul>
        <li>Employees from HR or Finance.</li>
        <li>Employees with salary between 60,000 and 90,000.</li>
        <li>Employees whose salary is either 70,000 or 90,000.</li>
        <li>Employees not in IT and salary above 70,000.</li>
        <li>Exclude employees from (HR, Marketing).</li>
        <li>Find employees with NULL department.</li>
        </ul>
        </p>`,
        a: `<pre><code class="language-python">
emp.filter(col("dept_id").isin("101","102")).show()
emp.filter(col("salary").between(60000,70000) ).show()
emp.filter(col("salary").isin(60000,70000) ).show()
emp.filter((~col("dept_id").isin("101")) & (col("salary")>70000)).show()
emp.filter(~col("dept_id").isin("101","102")).show()
emp.filter(col("dept_id").isNull()).show()
from pyspark.sql.functions import col, length

# 1. Names starting with 'A'
emp.filter(col("name").startswith("A")).show()
emp.filter(col("name").like("A%")).show()

# 2. Names ending with 'e'
emp.filter(col("name").endswith("e")).show()
emp.filter(col("name").like("%e")).show()

# 3. Names containing 'ar'
emp.filter(col("name").contains("ar")).show()
emp.filter(col("name").like("%ar%")).show()

# 4. Names NOT containing 'a'
emp.filter(~col("name").contains("a")).show()
emp.filter(~col("name").like("%a%")).show()

# 5. Names with exactly 5 characters
emp.filter(length(col("name")) == 5).show()
emp.filter(col("name").like("_____")).show()  # 5 underscores

# 6. Names beginning with a vowel
emp.filter(col("name").rlike("^[aeiouAEIOU]")).show()
  </code></pre>`,
  children:[],
      },
      {
        q: `<p style="color: cream">
        # Employees who joined after 2025-03-15.<br>
 Employees who joined before 2025-01-01..<br>
 Employees who joined in January..<br>
 Employees who joined in 2025..<br>
 Employees who joined in the last 30 days..<br>
 Employees who joined today..<br>
Employees who joined this month.
        </p>`,
        a: `<pre><code class="language-python">

        emp.filter(col("joining_date")>"2025-03-15").show()
emp.filter(col("joining_date")<"2025-01-01").show()
emp.filter(month(col("joining_date"))==1).show()
emp.filter(year(col("joining_date"))==2025).show()
emp.filter( col("joining_date").between(date_sub(current_date(),30),current_date())).show()
emp.filter(col("joining_date")==current_date()).show()
emp.filter(month(col("joining_date"))==month(current_date())).show()
  </code></pre>`,
  children:[],
      },

      {
        q: `<p style="color:brown">
        Employees not in IT and salary below 70,000.<br>
 Employees from HR with salary outside 50,000–70,000.<br>
 Employees whose names do not start with 'A'.<br>
 Employees with NULL salary or NULL department.<br>
 Employees from Finance older than 30 or salary above 90,000.<br>
 Employees whose names contain 'a' and end with 'e'.
        </p>`,
        a: `<pre><code class="language-python">
emp.filter((~col("dept_id").isin("101")) & (col("salary")<70000)).show()
emp.filter((col("dept_id").isin("101")) & (~col("salary").between(50000,70000))).show()
emp.filter((~col("name").startswith("A"))).show()
emp.filter(col("salary").isNull() | col("dept_id").isNull())
emp.filter(col("dept_id").isin("101") & ((col("salary")>90000) | (col("emp_id")>5) )).show()
emp.filter(col("name").endswith("e") & col("name").contains("a")).show()
  </code></pre>`,
  children:[],
      }
      
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
duplicate employee names.<br>
#5) new col with 20% of amount , 0 if not a valid amount


</p>`,
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

#5) new col with 20% of amount , 0 if not a valid amount
df.withColumn("new_amount", coalesce(expr("try_cast(amount as int)"), lit(0)) * 0.2).show()
</code></pre>



        `,
        tip: `df.count() does not accept any arguments. <br>
expr accepts only 1 statement , if multiple req use <b>selectExpr</b>
`,
        children: [],
      },
      {
        q: `
        <p style="color:violet">
        Find the department with the highest average salary.<br>
        Find departments where the average salary is greater than 70000.<br>
        Find departments having more than 3 employees.<br>
        Highest paid employee in each department
        </p>
        `,
        a: `
        <pre><code class="language-python">
#DEPT with highest avg sal
x=df.groupby("dept").agg(sum("salary").alias("avg_salary")).orderBy(col("avg_salary").desc()).take(1)
print(x[0][0],x[0][1])

#Find departments where the average salary is greater than 70000.
df.groupby("dept").agg(round(avg("salary"),2).alias("avg_salary")).filter(col("avg_salary")>70000).show()

#Find departments having more than 3 employees.
df.groupby("dept").agg(count("*").alias("counts")).filter(col("counts")>3).show()

#Highest paid employee in each department
window= Window.partitionBy("dept_id").orderBy(col("salary").desc())
emp.withColumn("rank",rank().over(window)).filter((col("rank")==1) & (col("dept_id").isNotNull())).display()        </code></pre>
        `,
        children: [],
      },
      {
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


      }

    ],

  },////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// new 
  {
    cat: `core`,
    q: `Core-2 joins`,
    answer: ``,
    children: [
      {
        q: `<p style="color:violet">
  Find employees whose department doesn't exist.
  </p>`,
        a: `<pre><code class="language-python">
  #Find employees whose department doesn't exist.
  emp.join(dept, "dept_id", "left") 
   .filter(col("dept_name").isNull()) 
   .select("emp_name") 
   .show()
  </code></pre>`,
      }

    ],

  },////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// new 
  {
    cat: `intermediate`,
    q: `Intermediate Windows`,
    answer: ``,
    children: [
      {
        q: `<p style="color:violet">Running salary total order by emp_id.
       </p>`,
        a: `<pre><code class="language-python">
window= Window.orderBy(col("emp_id").desc()).rowsBetween(Window.unboundedPreceding, Window.currentRow)
df.withColumn("running",sum("salary").over(window)).display()
       </code></pre>`,
        tip: `
In interviews — Ask for clarifications / always state your assumption if not told: "I'll assume running total across the full table ordered by emp_id"
<br>Running total / cumm total means we need to use rowsbetween explicitly else same date/ids may merge`,
        children: [],
      },
      {
        q: `	<p style="color:violet">Top N / Highest / Lowest per dept</p>`,
        tip: `For Top N problems — always clarify with interviewer whether ties should be included / say i am assuming this before starting problem . Default safe choice: DENSE_RANK.`,

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
      {
        q: `<p style="color:violet">
  Running / moving sum/avg
  </p>`,
        a: `<pre><code class="language-python">
  </code></pre>`,
        children: [],
      },
        {
        q: `<p style="color:violet">
        Find employees whose salary increased compared to the previous month.
        </p>`,
        a: `<pre><code class="language-python">

        w = Window.partitionBy("emp_id").orderBy("month")
emp.withColumn("prev_sal", lag("salary", 1).over(w)) \
   .filter(col("salary") > col("prev_sal")) \
   .select("emp_id", "month", "salary", "prev_sal").show()
  </code></pre>`,
  children:[],
      }
    ],

  },////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// new 
  {
    cat: `intermediate`,
    q: `intermediate-2`,
    answer: ``,
    children: [
      {
        q: `<p style="color:violet"></p>`,
        a: `<pre><code class="language-python">
  </code></pre>`,
  children:[],
      }
    ],

  },////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// new 
  {
    cat: `Advanced`,
    q: `Advanced-1`,
    answer: ``,
    children: [
      {
        q: `<p style="color:violet">
        sal greater than dept avg
        </p>`,
        a: `<pre><code class="language-python">
avg_sal= emp.groupBy("dept_id").agg(avg("salary").alias("sal_avg"))
emp.join(avg_sal,"dept_id","inner").filter(col("salary")>col("sal_avg")).show()

#alternate
emp.withColumn("avgs",avg("salary").over(Window.partitionBy("dept_id"))).filter(col("salary")>col("avgs")).show()
  </code></pre>
  
<pre><code class="language-sql">
with avgs as (select dept_id, avg(salary) as sal_avg from emp group by dept_id)
select dept_id,name,salary,sal_avg from emp join avgs using(dept_id) where salary>sal_avg
</code></pre>
  `,
  children:[],
      },
        {
        q: `<p style="color:violet">Find customers who haven't placed any orders in the last 90 days</p>`,
        a: `<pre><code class="language-python">
emp.alias("c").join(ord.alias("o"),
    (col("c.cust_id") == col("o.cust_id")) & 
    (col("o.order_date") >= current_date() - 90),
    "left"
).filter(col("o.cust_id").isNull()) \
 .select("c.cust_id", "c.name").show()

  </code></pre>`,
  children:[],
      }
    ],

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