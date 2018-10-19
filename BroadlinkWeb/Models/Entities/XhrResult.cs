using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace BroadlinkWeb.Models.Entities
{
    [NotMapped]
    public class XhrResult<T>
    {
        public static XhrResult<T> CreateSucceeded(T value)
        {
            var result = new XhrResult<T>();
            result.Succeeded = true;
            result.Values = value;
            return result;
        }

        public static XhrResult<T> CreateError(string message, string name = null)
        {
            var result = new XhrResult<T>();
            result.Succeeded = false;
            result.Errors = new Error[]
            {
                new Error() { Message = message, Name = name }
            };
            return result;
        }

        public static XhrResult<T> CreateError(IEnumerable<Error> errors)
        {
            var result = new XhrResult<T>();
            result.Succeeded = false;
            result.Errors = errors.ToArray();
            return result;
        }


        public bool Succeeded { get; set; } = true;

        public T Values { get; set; }

        public Error[] Errors { get; set; } = new Error[] { };
    }

    //public class XhrResult
    //{
    //    public static XhrResult CreateSucceeded(object value)
    //    {
    //        var result = new XhrResult();
    //        result.Succeeded = true;
    //        result.Values = value;
    //        return result;
    //    }

    //    public static XhrResult CreateError(string message, string name = null)
    //    {
    //        var result = new XhrResult();
    //        result.Succeeded = false;
    //        result.Errors = new Error[]
    //        {
    //            new Error() { Message = message, Name = name }
    //        };
    //        return result;
    //    }

    //    public static XhrResult CreateError(IEnumerable<Error> errors)
    //    {
    //        var result = new XhrResult();
    //        result.Succeeded = false;
    //        result.Errors = errors.ToArray();
    //        return result;
    //    }

    //    public bool Succeeded { get; set; } = true;

    //    public object Values { get; set; }

    //    public Error[] Errors { get; set; } = new Error[] { };
    //}
}
