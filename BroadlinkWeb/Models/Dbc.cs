﻿using BroadlinkWeb.Models.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BroadlinkWeb.Models
{
    /// <summary>
    /// DbContext class
    /// </summary>
    public class Dbc : DbContext
    {
        public DbSet<BrDevice> BrDevices { get; set; }

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="options"></param>
        public Dbc(DbContextOptions<Dbc> options)
            : base(options)
        {
        }
    }
}
